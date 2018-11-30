package com.jinchang.wechat.controller;


import com.alibaba.fastjson.JSONArray;
import com.jinchang.wechat.entity.HttpError;
import com.jinchang.wechat.entity.User;
import com.jinchang.wechat.entity.WechatAccessToken;
import com.jinchang.wechat.repository.TicketRepository;
import com.jinchang.wechat.repository.UserRepository;
import com.jinchang.wechat.repository.WechatAccessTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jinchang.wechat.util.HttpUtil;
import org.springframework.core.env.Environment;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import java.io.*;
import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import org.apache.http.client.ClientProtocolException;
import org.apache.commons.codec.digest.DigestUtils;
import weixin.popular.api.MessageAPI;
import weixin.popular.api.TokenAPI;
import weixin.popular.bean.media.MediaGetResult;
import weixin.popular.bean.message.templatemessage.TemplateMessage;
import weixin.popular.bean.message.templatemessage.TemplateMessageItem;
import weixin.popular.bean.message.templatemessage.TemplateMessageResult;
import weixin.popular.bean.token.Token;
import weixin.popular.api.MediaAPI;
import javax.servlet.http.HttpServletRequest;
import java.net.URLEncoder;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected WechatAccessTokenRepository wechatAccessTokenRepository;

    @Autowired
    protected TicketRepository ticketRepository;

    @Autowired
    private Environment env;

//    private String token;
//
//    public String getToken() throws IOException{
//        if (token == null) {
//            String email = env.getProperty("udesk.email");
//            HashMap<String, String> map = new HashMap();
//            map.put("email", email);
//            map.put("password", env.getProperty("udesk.password"));
//            String url = env.getProperty("udesk.url").concat("open_api_v1/log_in");
//            String result = HttpUtil.sendPost(url, JSON.toJSONString(map));
//            JSONObject  jsonObject = JSONObject.parseObject(result);
//            token = jsonObject.get("open_api_auth_token").toString();
//        }
//        return token;
//    }

    public String getAccessToken() {
        WechatAccessToken token = wechatAccessTokenRepository.findFirstByExpireAfter(new Date());
        if(token == null) {
            Token t = TokenAPI.token(env.getProperty("wechat.appId"), env.getProperty("wechat.appSecret"));
            System.out.println("access Token");
            System.out.println(JSON.toJSONString(t));
            WechatAccessToken newToken = new WechatAccessToken();
            newToken.setAccessToken(t.getAccess_token());
            Date now = new Date();
            newToken.setExpire(new Date(now.getTime() + t.getExpires_in() * 1000 - 300 * 1000));
            wechatAccessTokenRepository.save(newToken);
            return t.getAccess_token();
        }else{
            return token.getAccessToken();
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createJob(@RequestBody JSONObject request, HttpServletRequest r1) throws IOException, ParseException {
        String createUrl = generateUrl("open_api_v1/tickets");
        HashMap<String, Object> ticket = new HashMap();
        HashMap<String, Object>  newJob = new HashMap();
        HashMap<String, String> customer_field = new HashMap();
        newJob.put("subject", request.get("subject") != null ? request.get("subject").toString() : "");
        newJob.put("content", request.get("content") != null ? request.get("content").toString() : "");
        if(request.get("type") != null){
            customer_field.put("SelectField_17560", request.get("type").toString());
            newJob.put("ticket_field", customer_field);
        }
        newJob.put("type", "customer_id");
        newJob.put("type_content", r1.getAttribute("currentUdeskId").toString());
        ticket.put("ticket", newJob);
        System.out.println( "JSON.toJSONString(ticket)");
        System.out.println( JSON.toJSONString(ticket));
        String r = HttpUtil.sendPost(createUrl, JSON.toJSONString(ticket));
        return new ResponseEntity<String>(r ,HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<?> getJobs(HttpServletRequest r1) throws IOException{
        HashMap<String, Object> ticket = new HashMap();
        String key = env.getProperty("udesk.key");
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "找不到当前员工"),HttpStatus.UNAUTHORIZED);
        }
        String email = "ticket"+r1.getAttribute("currentUserId")+"@jc.com";
        String sign = DigestUtils.md5Hex("per_page=100&"+key);
        ticket.put("email", email);
        String url = env.getProperty("udesk.url").concat("api/v1/tickets/get?per_page=100&sign="+sign);
        System.out.print(url+"\n");
        System.out.print(email);
        String r = HttpUtil.sendPost(url, JSON.toJSONString(ticket));
        return new ResponseEntity<String>(r ,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public String getJobDetail(@PathVariable String id, HttpServletRequest r1) throws IOException{
        String url = generateUrl("open_api_v1/tickets/detail")+"&id="+id;
        String r = HttpUtil.sendGet(url);
        return r;
    }

    @GetMapping("/{id}/replies")
    public String getJobReplies(@PathVariable String id, HttpServletRequest r1) throws IOException{
        String url = generateUrl("open_api_v1/tickets/"+id+"/replies");
        String r = HttpUtil.sendGet(url);
        return r;
    }

    @PostMapping("/{id}/reply")
    public String sendReply(@PathVariable String id, @RequestBody JSONObject request,  HttpServletRequest r1) throws IOException {
        String url = generateUrl("open_api_v1/tickets/customer_reply");
        HashMap<String, Object> ticket = new HashMap();
        System.out.println(request.get("attachment_ids").toString());
        ticket.put("id", id);
        ticket.put("content_type", "text");
        ticket.put("new_reply", request.get("content"));
        ticket.put("attachment_ids", request.get("attachment_ids"));
        String r = HttpUtil.sendPost(url, JSON.toJSONString(ticket));
        return r;
    }

    @PostMapping("/notification")
    public String notification(@RequestBody JSONObject request) {
        System.out.println("request");
        System.out.println(request);
        if(request.get("type") != null){
           String type = request.get("type").toString();
           if(type.equals("ticket_add")){
               if(request.get("ticket.assignee.id") != null){
                   User agent = userRepository.findByAgentId(request.get("ticket.assignee.id").toString());
                   if(agent != null){
                       TemplateMessage message = new TemplateMessage();
                       message.setTemplate_id(env.getProperty("wechat.notification.job"));
                       message.setTouser(agent.getOpenId());
                       System.out.println(env.getProperty("wechat.notification.job"));
                       LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
                       d.put("first", new TemplateMessageItem("工单提交提醒", "#000000"));
                       d.put("keyword1", new TemplateMessageItem(request.get("id").toString(), "#000000"));
                       d.put("keyword2", new TemplateMessageItem(request.get("subject").toString(), "#000000"));
                       d.put("keyword3", new TemplateMessageItem(request.get("status").toString(), "#000000"));
                       d.put("keyword4", new TemplateMessageItem(request.get("assignee") == null ? " " : request.get("assignee").toString(), "#000000"));
                       d.put("remark", new TemplateMessageItem("工单提交人： "+request.get("user").toString()+"\n提交时间： "+request.get("created").toString(), "#000000"));
                       message.setData(d);
                       TemplateMessageResult result = MessageAPI.messageTemplateSend(getAccessToken(), message);
                   }
                   User us = userRepository.findByUdeskId(request.get("userId").toString());
                   if(us != null){
                       TemplateMessage message1 = new TemplateMessage();
                       message1.setTemplate_id(env.getProperty("wechat.notification.job"));
                       message1.setTouser(us.getOpenId());
                       LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
                       d.put("first", new TemplateMessageItem("工单提交提醒", "#000000"));
                       d.put("keyword1", new TemplateMessageItem(request.get("id").toString(), "#000000"));
                       d.put("keyword2", new TemplateMessageItem(request.get("subject").toString(), "#000000"));
                       d.put("keyword3", new TemplateMessageItem(request.get("status").toString(), "#000000"));
                       d.put("keyword4", new TemplateMessageItem(request.get("assignee") == null ? " " : request.get("assignee").toString(), "#000000"));
                       d.put("remark", new TemplateMessageItem("工单提交人： "+request.get("user").toString()+"\n提交时间： "+request.get("created").toString(), "#000000"));
                       message1.setData(d);
                       TemplateMessageResult result = MessageAPI.messageTemplateSend(getAccessToken(), message1);
                   }
               }
           }
            if(type.equals("reply")){
                User us = userRepository.findByUdeskId(request.get("userId").toString());
                if(us != null){
                    TemplateMessage message1 = new TemplateMessage();
                    message1.setTemplate_id(env.getProperty("wechat.notification.job"));
                    message1.setTouser(us.getOpenId());
                    LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
                    d.put("first", new TemplateMessageItem("工单回复提醒", "#000000"));
                    d.put("keyword1", new TemplateMessageItem(request.get("id").toString(), "#000000"));
                    d.put("keyword2", new TemplateMessageItem(request.get("subject").toString(), "#000000"));
                    d.put("keyword3", new TemplateMessageItem(request.get("status").toString(), "#000000"));
                    d.put("keyword4", new TemplateMessageItem(request.get("assignee") == null ? " " : request.get("assignee").toString(), "#000000"));
                    d.put("remark", new TemplateMessageItem("回复人： "+request.get("reply_agent").toString()+"\n回复时间： "+request.get("reply_at").toString(), "#000000"));
                    message1.setData(d);
                    TemplateMessageResult result = MessageAPI.messageTemplateSend(getAccessToken(), message1);
                }
            }
            if(type.equals("user_reply")){
                User us = userRepository.findByAgentId(request.get("ticket.assignee.id").toString());
                if(us != null){
                    TemplateMessage message1 = new TemplateMessage();
                    message1.setTemplate_id(env.getProperty("wechat.notification.job"));
                    message1.setTouser(us.getOpenId());
                    LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
                    d.put("first", new TemplateMessageItem("客户回复提醒", "#000000"));
                    d.put("keyword1", new TemplateMessageItem(request.get("id").toString(), "#000000"));
                    d.put("keyword2", new TemplateMessageItem(request.get("subject").toString(), "#000000"));
                    d.put("keyword3", new TemplateMessageItem(request.get("status").toString(), "#000000"));
                    d.put("keyword4", new TemplateMessageItem(request.get("ticket.assignee") == null ? " " : request.get("ticket.assignee").toString(), "#000000"));
                    d.put("remark", new TemplateMessageItem("回复时间： "+request.get("ticket.customer_replied_at").toString(), "#000000"));
                    message1.setData(d);
                    TemplateMessageResult result = MessageAPI.messageTemplateSend(getAccessToken(), message1);
                }
            }
            if(type.equals("change")){
                User agent = userRepository.findByAgentId(request.get("ticket.assignee.id").toString());
                if(agent != null){
                    TemplateMessage message = new TemplateMessage();
                    message.setTemplate_id(env.getProperty("wechat.notification.job"));
                    message.setTouser(agent.getOpenId());
                    System.out.println(env.getProperty("wechat.notification.job"));
                    LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
                    d.put("first", new TemplateMessageItem("工单分配提醒", "#000000"));
                    d.put("keyword1", new TemplateMessageItem(request.get("id").toString(), "#000000"));
                    d.put("keyword2", new TemplateMessageItem(request.get("subject").toString(), "#000000"));
                    d.put("keyword3", new TemplateMessageItem(request.get("status").toString(), "#000000"));
                    d.put("keyword4", new TemplateMessageItem(request.get("assignee") == null ? " " : request.get("assignee").toString(), "#000000"));
                    d.put("remark", new TemplateMessageItem("工单提交人： "+request.get("user").toString()+"\n提交时间： "+request.get("created").toString(), "#000000"));
                    message.setData(d);
                    TemplateMessageResult result = MessageAPI.messageTemplateSend(getAccessToken(), message);
                }
            }
        }
        return "ok";
    }

    @PostMapping("/{id}/uploadAttach")
    public String upload(@PathVariable String id, @RequestBody JSONObject request) throws IOException {
        System.out.println("jsonff");
        System.out.println(request.get("mediaIds").toString());
        String[] array = request.get("mediaIds").toString().split("\\|");

        for(int i=0; i<array.length; i++){
            String mediaId = array[i];
            MediaGetResult r = MediaAPI.mediaGet(getAccessToken(), mediaId);
            String url = generateUrl("open_api_v1/tickets/upload_file")+"&ticket_id="+id+"&file_name="+r.getFilename();
            String result = HttpUtil.sendFile(url, id, r.getBytes());
            System.out.println(result);
        }
        return "";
    }

    @PostMapping("/{id}/uploadReplyAttach")
    public String uploadReplyAttach(@PathVariable String id, @RequestBody JSONObject request) throws IOException {
        String mediaId = request.get("mediaId").toString();
        MediaGetResult r = MediaAPI.mediaGet(getAccessToken(), mediaId);
        String url = generateUrl("open_api_v1/tickets/upload_file_for_reply")+"&ticket_id="+id+"&file_name="+r.getFilename();
        String result = HttpUtil.sendFile(url, id, r.getBytes());
        System.out.println(result);
        return result;
    }


    @PostMapping("/{id}/solve")
    public String solveJob(@PathVariable String id,  HttpServletRequest r1) throws IOException {
        String key = env.getProperty("udesk.key");
        String sign = DigestUtils.md5Hex(key);
        String url = env.getProperty("udesk.url").concat("api/v1/tickets/"+id+"?sign="+sign);
        HashMap<String, Object> req = new HashMap();
        HashMap<String, Object> ticket = new HashMap();
        req.put("ticket", ticket);
        ticket.put("status", "resolved");
        String r = HttpUtil.sendPut(url, JSON.toJSONString(req));
        return r;
    }

    @GetMapping("/sign")
    public String sign() throws IOException {
        String email = env.getProperty("udesk.email");
        Date date = new Date();
        Long timeStamp = date.getTime();
        String token = env.getProperty("udesk.token");
        String sign = DigestUtils.sha1Hex(email+"&"+token+"&"+timeStamp);
        return "email="+email+"&timestamp="+timeStamp+"&sign="+sign;
    }

    public String generateUrl(String url){
        String email = env.getProperty("udesk.email");
        Date date = new Date();
        Long timeStamp = date.getTime();
        String token = env.getProperty("udesk.token");
        String sign = DigestUtils.sha1Hex(email+"&"+token+"&"+timeStamp);
        return env.getProperty("udesk.url").concat(url+"?email="+email+"&timestamp="+timeStamp+"&sign="+sign);
    }
}

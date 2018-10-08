package com.jinchang.wechat.controller;


import com.alibaba.fastjson.JSONArray;
import com.jinchang.wechat.entity.User;
import com.jinchang.wechat.entity.WechatAccessToken;
import com.jinchang.wechat.repository.TicketRepository;
import com.jinchang.wechat.repository.UserRepository;
import com.jinchang.wechat.repository.WechatAccessTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/jobs")
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
    public String createJob(@RequestBody JSONObject request,  HttpServletRequest r1) throws IOException, ParseException {
        String createUrl = generateUrl("open_api_v1/tickets");
        HashMap<String, Object> ticket = new HashMap();
        HashMap<String, String>  newJob = new HashMap();
        newJob.put("subject", request.get("subject") != null ? request.get("subject").toString() : "");
        newJob.put("content", request.get("content") != null ? request.get("content").toString() : "");
        newJob.put("type", "customer_id");
        newJob.put("type_content", r1.getAttribute("currentUdeskId").toString());
        ticket.put("ticket", newJob);
        String r = HttpUtil.sendPost(createUrl, JSON.toJSONString(ticket));
        JSONObject createResult = JSON.parseObject(r);
        if(createResult.get("code") != null && createResult.get("code").toString().equals("1000") && createResult.get("ticket_id") != null){
            String orderId = createResult.get("ticket_id").toString();
            String detailUrl = generateUrl("open_api_v1/tickets/detail")+"&id="+orderId;
            String detail = HttpUtil.sendGet(detailUrl);
            System.out.println("detail");
            System.out.println(detail);
            JSONObject detailObject = JSON.parseObject(detail);
            if(detailObject.get("ticket") != null) {
                JSONObject ticketObject = JSON.parseObject(detailObject.get("ticket").toString());
                if(ticketObject.get("assignee_id") != null){
                    String agentId = ticketObject.get("assignee_id").toString();
                    User agent = userRepository.findByAgentId(agentId);
                    TemplateMessage message = new TemplateMessage();
                    message.setTemplate_id("kIJ_qOwW6d0_pV1IXSK6nU8MkSXIKf3FSD7xjBb2054");
                    message.setTouser(agent.getOpenId());
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date date = sdf.parse(ticketObject.get("updated_at").toString().replace("T", " "));
                    LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
                    d.put("first", new TemplateMessageItem("新建工单提醒", "#000000"));
                    d.put("keyword1", new TemplateMessageItem(ticketObject.get("subject").toString(), "#000000"));
                    d.put("keyword2", new TemplateMessageItem(ticketObject.get("user_name").toString(), "#000000"));
                    d.put("keyword3", new TemplateMessageItem(sdf.format(date), "#000000"));
                    d.put("remark", new TemplateMessageItem("请尽快回复", "#000000"));
                    message.setData(d);
                    TemplateMessageResult result = MessageAPI.messageTemplateSend(getAccessToken(), message);
                    System.out.println(result.toString());
                }
            }
        }
        return r;
    }

    @GetMapping("")
    public String getJobs(HttpServletRequest r1) throws IOException{
        HashMap<String, Object> ticket = new HashMap();
        String key = env.getProperty("udesk.key");;
        String email = "ticket"+r1.getAttribute("currentUserId")+"@jc.com";
        String sign = DigestUtils.md5Hex("per_page=100&"+key);
        ticket.put("email", email);
        String url = env.getProperty("udesk.url").concat("api/v1/tickets/get?per_page=100&sign="+sign);
        System.out.print(url+"\n");
        System.out.print(email);
        String r = HttpUtil.sendPost(url, JSON.toJSONString(ticket));
        return r;
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

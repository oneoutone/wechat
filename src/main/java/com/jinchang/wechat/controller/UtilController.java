package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.AuthCode;
import com.jinchang.wechat.entity.HttpError;
import com.jinchang.wechat.entity.JsapiTicket;
import com.jinchang.wechat.entity.WechatAccessToken;
import com.jinchang.wechat.repository.AuthCodeRepository;
import com.jinchang.wechat.repository.JsapiTicketRepository;
import com.jinchang.wechat.repository.WechatAccessTokenRepository;
import com.jinchang.wechat.util.HttpUtil;
import org.apache.catalina.util.URLEncoder;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import weixin.popular.api.TokenAPI;
import weixin.popular.bean.ticket.Ticket;
import weixin.popular.bean.token.Token;
import weixin.popular.api.TicketAPI;
import weixin.popular.util.JsUtil;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;

@RestController
@RequestMapping("/api/util")
public class UtilController {

    @Autowired
    protected WechatAccessTokenRepository wechatAccessTokenRepository;

    @Autowired
    protected JsapiTicketRepository jsapiTicketRepository;

    @Autowired
    protected AuthCodeRepository authCodeRepository;

    @Autowired
    private Environment env;

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

    public String getTicket() {
        JsapiTicket ticket = jsapiTicketRepository.findFirstByExpireAfter(new Date());
        if(ticket == null){
            Ticket t = TicketAPI.ticketGetticket(getAccessToken());
            Date now = new Date();
            JsapiTicket newTicket = new JsapiTicket();
            newTicket.setExpire(new Date(now.getTime() + t.getExpires_in() * 1000 - 300 * 1000));
            newTicket.setTicket(t.getTicket());
            jsapiTicketRepository.save(newTicket);
            return t.getTicket();
        }else{
            return ticket.getTicket();
        }
    }

    @PostMapping("/sendAuthCode")
    public ResponseEntity<?> sendAuthCode(@RequestBody JSONObject request) throws IOException{
        String phone = null;
        if(request.get("phone") != null){
            phone = request.get("phone").toString();
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "没有手机号"),HttpStatus.BAD_REQUEST);

        }
        Random ran1 = new Random();
        String code = "";
        for(int i=0; i<6; i++){
            code += ran1.nextInt(10);
        }
        Date expire = new Date((new Date()).getTime()+60000);
        AuthCode authCode = new AuthCode();
        authCode.setCode(code);
        authCode.setPhone(phone);
        authCode.setExpire(expire);
        authCodeRepository.save(authCode);
        String url = "http://v.juhe.cn/sms/send.php?mobile="+phone+"&tpl_id=106635&tpl_value=%23code%23%3d"+code+"&key=e7ca3042db7bb9ef00e4ba86b6a61e71";
        String result = HttpUtil.sendGet(url);
        JSONObject r = new JSONObject();
        r.put("result", "ok");
        return new ResponseEntity<JSONObject>(r,HttpStatus.OK);
    }

    @PostMapping("/wechatSign")
    public String sendReply(@RequestBody JSONObject request, HttpServletRequest r1) throws IOException {
        String r = JsUtil.generateConfigJson(getTicket(), false, env.getProperty("wechat.appId"), request.get("url").toString(), "chooseImage", "uploadImage", "getLocalImgData", "previewImage");
        System.out.println(request.get("url").toString());
        System.out.println(r);
        return r;
    }


}

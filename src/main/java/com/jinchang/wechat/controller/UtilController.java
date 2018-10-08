package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.JsapiTicket;
import com.jinchang.wechat.entity.WechatAccessToken;
import com.jinchang.wechat.repository.JsapiTicketRepository;
import com.jinchang.wechat.repository.WechatAccessTokenRepository;
import com.jinchang.wechat.util.HttpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;
import weixin.popular.api.TokenAPI;
import weixin.popular.bean.ticket.Ticket;
import weixin.popular.bean.token.Token;
import weixin.popular.api.TicketAPI;
import weixin.popular.util.JsUtil;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;

@RestController
@RequestMapping("/util")
public class UtilController {

    @Autowired
    protected WechatAccessTokenRepository wechatAccessTokenRepository;

    @Autowired
    protected JsapiTicketRepository jsapiTicketRepository;

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

    @PostMapping("/wechatSign")
    public String sendReply(@RequestBody JSONObject request, HttpServletRequest r1) throws IOException {
        String r = JsUtil.generateConfigJson(getTicket(), true, env.getProperty("wechat.appId"), request.get("url").toString(), "chooseImage", "uploadImage", "getLocalImgData", "previewImage");
        System.out.println(request.get("url").toString());
        System.out.println(r);
        return r;
    }

}

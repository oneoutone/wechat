package com.jinchang.wechat.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.Ticket;
import com.jinchang.wechat.entity.User;
import com.jinchang.wechat.repository.TicketRepository;
import com.jinchang.wechat.repository.UserRepository;
import com.jinchang.wechat.util.HttpUtil;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Component
public class QuartzService {

    @Autowired
    private Environment env;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected TicketRepository ticketRepository;

    @Scheduled(cron = "0 0 */1 * * ?")
    public void generateScore() throws IOException {
        ArrayList<JSONObject>  list = new ArrayList<>();
        int page = 1;
        int pageNum = 1;
        System.out.println("Scheduled");
//        User u =userRepository.findById(29);
        //System.out.println(u.getNickName());
        do {
            System.out.println("round");
            fetchOrders(list, page, pageNum);
        }
        while(page < pageNum);

        System.out.println("deal");
        System.out.println(list.size());

        for(int i=0; i<list.size(); i++){
            JSONObject json = JSON.parseObject(list.get(i).get("ticket").toString());
            String userId = json.get("user_id").toString();
            System.out.println(userId);
            Ticket ticket = ticketRepository.findByUdeskId(userId);
            if(ticket == null) {
                JSONObject customField = JSON.parseObject(json.get("custom_fields").toString());
                if(customField.get("SelectField_16691") != null){
                    System.out.println("stttttttt");
                    System.out.println(customField.get("SelectField_16691").toString());
                    int score = Integer.parseInt(customField.get("SelectField_16691").toString())+1;
                    System.out.println(score);
                    User user = userRepository.findByUdeskId(userId);
                    if(user == null) {
                        continue;
                    }else{
                      user.setScore(user.getScore()+ score);
                      userRepository.save(user);
                      Ticket newTicket = new Ticket();
                      newTicket.setUserId(user.getId());
                      newTicket.setScore(score);
                      newTicket.setUdeskId(userId);
                      ticketRepository.save(newTicket);
                    }
                }else{
                    continue;
                }
            }else{
                continue;
            }
        }

    }

    public void fetchOrders(List list, int page, int pageNum) throws IOException {
        String url = generateUrl("open_api_v1/tickets/tickets_in_filter")+"&filter_id="+env.getProperty("udesk.scoreFilterId")+"&page="+page+"&per_page=100";;
        String r = HttpUtil.sendGet(url);
        JSONObject o = JSON.parseObject(r);
        System.out.print(o.get("code").toString());
        if(o.get("code").toString().equals("1000")){
            System.out.println("hello");
            JSONObject meta = JSON.parseObject(o.get("meta").toString());
            System.out.println(meta.get("total_pages"));
            pageNum = Integer.parseInt(meta.get("total_pages").toString());
            page ++;
            System.out.print(pageNum);
            System.out.print(page);
            JSONArray a = JSON.parseArray(o.get("contents").toString());
            System.out.print(a.size());
            for(int i=0; i<a.size(); i++){
                JSONObject record = a.getJSONObject(i);
                list.add(record);
            }
        }
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

package com.jinchang.wechat.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.ScoreHistory;
import com.jinchang.wechat.entity.Ticket;
import com.jinchang.wechat.entity.User;
import com.jinchang.wechat.repository.*;
import com.jinchang.wechat.util.HttpUtil;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.jinchang.wechat.entity.LDAPOrganization;
import com.jinchang.wechat.entity.Organization;
import com.jinchang.wechat.entity.Employee;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Iterator;

@Component
public class QuartzService {

    @Autowired
    private Environment env;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected TicketRepository ticketRepository;

    @Autowired
    protected ScoreHistoryRepository scoreHistoryRepository;

    @Autowired
    protected LDAPUserRepository lDAPUserRepository;

    @Autowired
    protected OrganizationRepository organizationRepository;

    @Autowired
    protected EmployeeRepository employeeRepository;


    @Scheduled(cron = "0 0 */1 * * ?")
    public void generateScore() throws IOException {
        ArrayList<JSONObject>  list = new ArrayList<>();
        int page = 1;
        int pageNum = 1;
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
                    System.out.println(customField.get("SelectField_16691").toString());
                    int score = Integer.parseInt(customField.get("SelectField_16691").toString());
                    if(score == 0){
                        score = 0;
                    }
                    if(score == 1){
                        score = 3;
                    }
                    if(score == 2){
                        score = 5;
                    }
                    if(score == 3){
                        score = 10;
                    }
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

                        ScoreHistory scoreHistory = new ScoreHistory();
                        scoreHistory.setType("add");
                        scoreHistory.setUserId(user.getId());
                        scoreHistory.setRemark("创建工单");
                        scoreHistory.setScore(score);
                        scoreHistory.setCreated(new Date());
                        scoreHistoryRepository.save(scoreHistory);
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

    @Scheduled(cron = "0 0 1 * * ?")
    public void updateOrg() throws IOException {
        List<LDAPOrganization> p = lDAPUserRepository.findOrgnaizations();
        List<LDAPOrganization> u = new ArrayList<>();
        for(int i = 0; i<p.size(); i++ ){
            if(p.get(i).getJcparentdeptcode() != null || p.get(i).getJcchnname().equals("锦创集团")){
                u.add(p.get(i));
            }
        }
        System.out.println("start");
        System.out.println(u.size());
        int base = 0;
        for(int i = 0; i<u.size(); i++ ){
            if(u.get(i).getJcchnname().equals("锦创集团")){
                base = i;
                break;
            }
        }
        LDAPOrganization root = u.get(base);
        System.out.println("base"+base);
        organizationRepository.deleteAll();
        employeeRepository.deleteAll();
        System.out.println("1");
        Organization rootOrg = new Organization();
        rootOrg.setLevel(1);
        rootOrg.setCode(root.getCn());
        rootOrg.setName(root.getJcchnname());
        rootOrg.setOrgCode(root.getJcorgcode());
        rootOrg.setOrgTree(root.getJcchnname());
        rootOrg.setShowAsChoice(false);
        organizationRepository.save(rootOrg);
        u.remove(base);
        int index = 1;
        System.out.println("2");
        List<String> preCn = new ArrayList<>();
        preCn.add(rootOrg.getCode());
        List<Organization> preOrgs = new ArrayList<>();
        preOrgs.add(rootOrg);
        System.out.println("3");
        do {
            index ++;
            List<Organization> orgs = new ArrayList<>();
            Iterator<LDAPOrganization> iterator = u.iterator();
            while (iterator.hasNext()) {
                LDAPOrganization item = iterator.next();
                int indexOfOrg = preCn.indexOf(item.getJcparentdeptcode());
                if(indexOfOrg != -1){
                    Organization obj = new Organization();
                    obj.setLevel(index);
                    obj.setCode(item.getCn());
                    obj.setName(item.getJcchnname());
                    obj.setOrgCode(item.getJcorgcode());
                    obj.setParent(preOrgs.get(indexOfOrg).getCode());
                    obj.setOrgTree(preOrgs.get(indexOfOrg).getOrgTree() + "," +item.getJcchnname());
                    orgs.add(obj);
                    iterator.remove();
                    if(item.getUniquemember() != null && item.getUniquemember().size() > 0){
                        for(int a=0; a<item.getUniquemember().size(); a++){
                            Employee ep = new Employee();
                            ep.setEmployeeId(item.getUniquemember().get(a).split(",")[0].substring(3));
                            ep.setOrgCode(item.getCn());
                            ep.setOrgName(item.getJcchnname());
                            ep.setOrgTree(obj.getOrgTree());
                            employeeRepository.save(ep);
                        }
                    }
                }
            }
            List<Organization> organs = organizationRepository.saveAll(orgs);
            preOrgs = organs;
            preCn = new ArrayList<>();
            for(int j=0; j<preOrgs.size(); j++){
                preCn.add(preOrgs.get(j).getCode());
            }
        } while(u.size() > 0);
    }

}

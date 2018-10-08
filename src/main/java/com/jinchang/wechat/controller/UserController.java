package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSONArray;
import com.jinchang.wechat.entity.*;
import com.jinchang.wechat.exception.TokenException;
import com.jinchang.wechat.repository.*;
import com.jinchang.wechat.util.HttpUtil;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import javax.servlet.http.HttpServletRequest;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import weixin.popular.api.SnsAPI;
import weixin.popular.api.TokenAPI;
import weixin.popular.api.UserAPI;
import org.springframework.core.env.Environment;
import weixin.popular.bean.sns.SnsToken;
import com.jinchang.wechat.repository.AccessTokenRepository;
import com.jinchang.wechat.entity.AccessToken;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import weixin.popular.bean.token.Token;
import io.jsonwebtoken.Jwts;
import com.jinchang.wechat.entity.HttpError;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected WechatAccessTokenRepository wechatAccessTokenRepository;

    @Autowired
    protected AccessTokenRepository accessTokenRepository;

    @Autowired
    protected BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    protected LDAPUserRepository lDAPUserRepository;

    @Autowired
    private Environment env;

    private String udeskToken;

    public String getUdeskToken() throws IOException {
        if (udeskToken == null) {
            String email = env.getProperty("udesk.email");
            HashMap<String, String> map = new HashMap();
            map.put("email", email);
            map.put("password", env.getProperty("udesk.password"));
            String url = env.getProperty("udesk.url").concat("open_api_v1/log_in");
            String result = HttpUtil.sendPost(url, JSON.toJSONString(map));
            JSONObject  jsonObject = JSONObject.parseObject(result);
            udeskToken = jsonObject.get("open_api_auth_token").toString();
        }
        return udeskToken;
    }


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

    @RequestMapping("/hello")
    public LDAPUser hello(HttpServletRequest request) {
        LDAPUser u = lDAPUserRepository.findByCn("1100081603054");
        System.out.println(u.getTelephonenumber());
        System.out.println(u.getMail());
        System.out.println("fky");
        return u ;
    }

    @PostMapping("/profile")
    public Object setProfile(@RequestBody JSONObject request, HttpServletRequest r1) throws IOException {
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        User usr = userRepository.findById(userId);
        if(request.get("nickName") != null){
            usr.setNickName(request.get("nickName").toString());
        }
        if(request.get("email") != null){
            System.out.println(request.get("email").toString());
            User u = userRepository.findByEmail(request.get("email").toString());
            if(u != null) {
                System.out.println(u.getEmail());
                return new HttpError(403, "邮箱已存在");
            }else{
                usr.setEmail(request.get("email").toString());
                String url = generateUrl("open_api_v1/agents");
                String agents = HttpUtil.sendGet(url);
                JSONObject json = JSONObject.parseObject(agents);
                if(json.get("code").toString().equals("1000")){
                    JSONArray aList = JSONObject.parseArray(json.get("agents").toString());
                    for(int i=0; i<aList.size(); i++){
                        JSONObject agent = aList.getJSONObject(i);
                        if(agent.get("email") != null){
                            if(agent.get("email").toString().equals(request.get("email").toString())){
                                usr.setAgentId(agent.get("id").toString());
                            }
                        }
                    }
                }
            }
        }
        if(request.get("phone") != null){
            usr.setPhone(request.get("phone") .toString());
        }
        userRepository.save(usr);
        return usr;
    }

    @RequestMapping("/profile")
    public JSONObject getProfile(HttpServletRequest r1) {
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        User user = userRepository.findById(userId);
        JSONObject json = new JSONObject();
        json.put("id", user.getId());
        json.put("nickName", user.getNickName());
        json.put("email", user.getEmail());
        json.put("phone", user.getPhone());
        json.put("score", user.getScore());
        json.put("headerUrl", user.getImageUrl());
        json.put("clientRoles", user.getClientRoles());
        json.put("managerRoles", user.getManagerRoles());
        return json;
    }

    @RequestMapping("/managers/{id}/profile")
    public JSONObject getProfile(@PathVariable String id) {
        User user = userRepository.findById(Long.parseLong(id));
        JSONObject json = new JSONObject();
        json.put("id", user.getId());
        json.put("username", user.getUsername());
        json.put("email", user.getEmail());
        json.put("phone", user.getPhone());
        json.put("managerRoles", user.getManagerRoles());
        return json;
    }

    @PostMapping("/initAdmin")
    public String initAdmin() {
        User admin = userRepository.findByUsername("admin");
        if(admin != null){
            return "fail";
        }
        User user = new User();
        user.setUsername("admin");
        user.setPassword( bCryptPasswordEncoder.encode("12345"));
        user.setManagerRoles("admin");
        userRepository.save(user);
        return "success";
    }

    @DeleteMapping("/managers/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable String id) {
        User u = userRepository.findById(Long.parseLong(id));
        if(u == null || u.getManagerRoles() == null) {
            return new ResponseEntity<HttpError>(new HttpError(404, "管理员不存在"),HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(Long.parseLong(id));
        JSONObject json = new JSONObject();
        json.put("result", "ok");
        return new ResponseEntity<JSONObject>(json ,HttpStatus.OK);
    }

    @PostMapping("/managers/upsert")
    public ResponseEntity<?> createManager(@RequestBody JSONObject request) {
        User newUser;
        if(request.get("id") != null){
            newUser = userRepository.findById(Long.parseLong(request.get("id").toString()));
        }else{
            newUser = new User();
        }
        newUser.setAutoEmail(false);
        if(request.get("username") != null){
            newUser.setUsername(request.get("username").toString());
        }
        if(request.get("password") != null){
            newUser.setPassword(bCryptPasswordEncoder.encode(request.get("password").toString()));
        }
        if(request.get("managerRoles") != null){
            newUser.setManagerRoles(request.get("managerRoles").toString());
        }
//        if(request.get("employeeId") != null){
//            newUser.setEmployeeId(request.get("employeeId").toString());
//        }
        if(request.get("email") != null){
            newUser.setEmail(request.get("email").toString());
        }
        if(request.get("phone") != null){
            newUser.setPhone(request.get("phone").toString());
        }
        User u = userRepository.save(newUser);
        return new ResponseEntity<User>(u ,HttpStatus.OK);
    }

    @GetMapping("/managers/list")
    public ResponseEntity<?> ManagerList() {
        List<User> us = userRepository.findAllByManagerRolesIsNotNull();
        List<JSONObject> managers = new ArrayList<>();
        for(int i=0 ; i<us.size(); i++){
            JSONObject json = new JSONObject();
            json.put("id", us.get(i).getId());
            json.put("username", us.get(i).getUsername());
            json.put("email", us.get(i).getEmail());
            json.put("phone", us.get(i).getPhone());
            json.put("managerRoles", us.get(i).getManagerRoles());
            managers.add(json);
        }
        return new ResponseEntity<List<JSONObject>>(managers ,HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody JSONObject request) {
        String username = request.get("username").toString();
        String password = request.get("pwd").toString();
        String encodePassword = bCryptPasswordEncoder.encode(password);
        User u = userRepository.findByUsername(username);
        if(u == null || bCryptPasswordEncoder.matches(password, u.getPassword()) == false){
            return new ResponseEntity<HttpError>(new HttpError(401, "用户不存在"),HttpStatus.UNAUTHORIZED);
        }else{
            if(u.getManagerRoles() == null) {
                return new ResponseEntity<HttpError>(new HttpError(401, "用户没有后台管理权限"),HttpStatus.UNAUTHORIZED);
            }else{
                String[] roles = u.getManagerRoles().split(",");
                Boolean isManager = true;
                for(int i=0; i<roles.length; i++){
                    if(roles[i].equals("office") || roles[i].equals("admin")){
                        isManager = true;
                    }
                }
                if(isManager == true){
                    String newTokenString = Jwts.builder()
                            .setSubject(u.getUsername())
                            .setExpiration(new Date(System.currentTimeMillis() + 365 * 24 * 60 * 60 * 1000)) // 设置过期时间 365 * 24 * 60 * 60秒(这里为了方便测试，所以设置了1年的过期时间，实际项目需要根据自己的情况修改)
                            .signWith(SignatureAlgorithm.HS512, "MyJwtSecret") //采用什么算法是可以自己选择的，不一定非要采用HS512
                            .compact();
                    AccessToken newToken = new AccessToken();
                    newToken.setAccessToken(newTokenString);
                    newToken.setUserId(u.getId());
                    newToken.setExpire(new Date(System.currentTimeMillis() + 365 * 24 * 60 * 60 * 1000));
                    accessTokenRepository.save(newToken);
                    JSONObject result = new JSONObject();
                    result.put("accessToken", newTokenString);
                    result.put("userId", u.getId());
                    result.put("expire", newToken.getExpire());
                    result.put("roles", "admin");
                    return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);

                }else{
                    return new ResponseEntity<HttpError>(new HttpError(401, "用户没有后台管理权限"),HttpStatus.UNAUTHORIZED);

                }
            }
        }
    }

    @PostMapping("/signup")
    public User signUp(@RequestBody User user) {
        User currentUser = userRepository.findByUsername(user.getUsername());
        if(null == currentUser){
            System.out.println("no user");
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
        }else{
            System.out.println(currentUser.getId());
        }


         return user;
    }

    @PostMapping("/wechatAuth")
    public Object wechatAuth(@RequestBody JSONObject request) throws IOException{
        SnsToken token = SnsAPI.oauth2AccessToken(env.getProperty("wechat.appId"), env.getProperty("wechat.appSecret"), request.get("code").toString());
        if(token == null || token.getAccess_token() == null || token.getOpenid() == null) {
            return new HttpError(401, "code无效");
        }
        User currentUser = userRepository.findByOpenId(token.getOpenid());
        if(currentUser == null) {
            weixin.popular.bean.user.User u = UserAPI.userInfo(getAccessToken(), token.getOpenid());
            JSONObject profile = JSON.parseObject(JSON.toJSONString(u));
            currentUser = new User();
            currentUser.setUsername(token.getOpenid());
            currentUser.setPassword(bCryptPasswordEncoder.encode("12345"));
            currentUser.setOpenId(token.getOpenid());
            currentUser.setNickName(profile.get("nickname").toString());
            currentUser.setImageUrl(profile.get("headimgurl").toString());
            currentUser.setAutoEmail(true);
            currentUser =  userRepository.save(currentUser);
        }

        if(currentUser.getUdeskId() == null) {
            HashMap<String, Object> udeskCustomer = new HashMap();
            HashMap<String, String> customer = new HashMap();
            customer.put("nick_name", currentUser.getNickName());
            customer.put("email", "ticket"+currentUser.getId()+"@jc.com");
            udeskCustomer.put("customer", customer);
            String url = generateUrl("open_api_v1/customers");
            String r = HttpUtil.sendPost(url, JSON.toJSONString(udeskCustomer));
            JSONObject c = JSON.parseObject(r);
            if(c.get("customer") != null){
                JSONObject nc = JSON.parseObject(c.get("customer").toString());
                String uId = nc.get("id").toString();
                currentUser.setUdeskId(uId);
                System.out.print("hello world");
                System.out.print(c.get("customer").toString());
                userRepository.save(currentUser);
            }
        }

        String newTokenString = Jwts.builder()
                .setSubject(currentUser.getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + 365 * 24 * 60 * 60 * 1000)) // 设置过期时间 365 * 24 * 60 * 60秒(这里为了方便测试，所以设置了1年的过期时间，实际项目需要根据自己的情况修改)
                .signWith(SignatureAlgorithm.HS512, "MyJwtSecret") //采用什么算法是可以自己选择的，不一定非要采用HS512
                .compact();
        AccessToken newToken = new AccessToken();
        newToken.setAccessToken(newTokenString);
        newToken.setUserId(currentUser.getId());
        newToken.setExpire(new Date(System.currentTimeMillis() + 365 * 24 * 60 * 60 * 1000));
        accessTokenRepository.save(newToken);
        JSONObject result = new JSONObject();
        result.put("accessToken", newTokenString);
        result.put("userId", currentUser.getId());
        result.put("udeskId", currentUser.getUdeskId());
        result.put("expire", newToken.getExpire());
        return result;
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

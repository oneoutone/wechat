package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSONArray;
import com.jinchang.wechat.entity.*;
import com.jinchang.wechat.exception.TokenException;
import com.jinchang.wechat.repository.*;
import com.jinchang.wechat.util.HttpUtil;
import io.jsonwebtoken.SignatureAlgorithm;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import javax.servlet.http.HttpServletRequest;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import weixin.popular.api.MessageAPI;
import weixin.popular.api.SnsAPI;
import weixin.popular.api.TokenAPI;
import weixin.popular.api.UserAPI;
import org.springframework.core.env.Environment;
import weixin.popular.bean.message.templatemessage.TemplateMessage;
import weixin.popular.bean.message.templatemessage.TemplateMessageItem;
import weixin.popular.bean.message.templatemessage.TemplateMessageResult;
import weixin.popular.bean.sns.SnsToken;
import com.jinchang.wechat.repository.AccessTokenRepository;
import com.jinchang.wechat.entity.AccessToken;

import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import weixin.popular.bean.token.Token;
import io.jsonwebtoken.Jwts;
import com.jinchang.wechat.entity.HttpError;


@RestController
@RequestMapping("/api/users")
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
    protected AuthCodeRepository authCodeRepository;

    @Autowired
    protected ScoreHistoryRepository scoreHistoryRepository;

    @Autowired
    protected OrganizationRepository organizationRepository;

    @Autowired
    protected EmployeeRepository employeeRepository;

    @Autowired
    protected RegisterRepository registerRepository;

    @Autowired
    protected RegisterHistoryRepository registerHistoryRepository;

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

    @RequestMapping("/hello1")
    public String hello1(HttpServletRequest request) throws FileNotFoundException, IOException, BiffException {
        // 创建输入流，读取Excel
        File file = new File("/Users/liyuan/Documents/newProject/file.xlsx");
        BufferedInputStream in = new BufferedInputStream(new FileInputStream(file));
        //POIFSFileSystem fs = new POIFSFileSystem(in);
        // jxl提供的Workbook
        XSSFWorkbook wb = new XSSFWorkbook(in);
        XSSFSheet st = wb.getSheetAt(0);
        String result = "[";
        for (int rowIndex = 2; rowIndex <= 633; rowIndex++) {
            String r = "{";
            XSSFRow row = st.getRow(rowIndex);
            if (row == null) {
                continue;
            }
            for (short columnIndex = 1; columnIndex <= 2; columnIndex++) {
                XSSFCell cell = row.getCell(columnIndex);
                if (columnIndex ==1 && cell != null) {
                    String name = cell.getStringCellValue();
                    r += "name: '" + cell.getStringCellValue() + "'";
                    System.out.println(name);
                    List<LDAPUser> u = lDAPUserRepository.findByName(name);
                    if(u != null && u.size() == 1){
                        r+=", employeeId: '"+u.get(0).getCn()+ "'";
                    }
                }
                if (columnIndex ==2 && cell != null) {
                    r += ", org: '"+cell.getStringCellValue()+"'";
                }
            }
            r += "},\n";
            result += r;
        }
        System.out.println(result);
    return "ok";
    }

    @RequestMapping("/hello")
    public String hello(HttpServletRequest request) throws IOException {
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
        return "123";
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
    public ResponseEntity<?> getProfile(HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
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
        json.put("emplyeeId", user.getEmployeeId());
        json.put("managerRoles", user.getManagerRoles());
        json.put("buildings", user.getBuildings());
        Employee employee = employeeRepository.findAllByEmployeeId(user.getEmployeeId());
        if(employee != null){
            json.put("org", employee.getOrgName());
            json.put("orgTree", employee.getOrgTree());
        }

        if(user != null && user.getEmployeeId() != null){
            LDAPUser ldapUser = lDAPUserRepository.findByCn(user.getEmployeeId());
            if(ldapUser == null || ldapUser.getJcemployeeleavedate() != null){
                return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
            }else{
                json.put("status", ldapUser.getJcemployeestatus());
            }
        }
        return new ResponseEntity<JSONObject>(json ,HttpStatus.OK);
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
        json.put("buildings", user.getBuildings());
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
        if(request.get("buildings") != null){
            newUser.setBuildings(request.get("buildings").toString());
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

    @GetMapping("/company/{id}")
    public ResponseEntity<?> employeeList(@PathVariable String id, @RequestParam(required=false, defaultValue = "") int page) {
        if(page > 0){
            page -= 1;
        }
        System.out.println("calc value");
        System.out.println(id);
        Page<User> r = userRepository.findAllByCompanyId(Long.parseLong(id), PageRequest.of(page, 10, Sort.Direction.DESC, "created"));
        JSONObject result = new JSONObject();
        result.put("userList", r.getContent());
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("/company/{id}/count")
    public ResponseEntity<?> employeeCount(@PathVariable String id) {
        int r = userRepository.countCompanyUser(Long.parseLong(id));
        JSONObject result = new JSONObject();
        result.put("count", r);
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
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

    @PostMapping("/upsertEmployee")
    public ResponseEntity<?> upsertEmployee(@RequestBody User user) {
        User u = new User();
        if(user.getId() > 0){
            u = userRepository.findById(user.getId());
        }else{
            if(user.getPhone() == null) {
                return new ResponseEntity<HttpError>(new HttpError(400, "请输入手机号"),HttpStatus.BAD_REQUEST);
            }
            if(user.getCompanyId() == 0) {
                return new ResponseEntity<HttpError>(new HttpError(400, "没有员工公司信息"),HttpStatus.BAD_REQUEST);
            }
            u.setUsername(user.getPhone().toString());
            u.setPassword(bCryptPasswordEncoder.encode("12345"));
            u.setCompanyId(user.getCompanyId());
        }
        if(user.getNickName() != null){
            u.setNickName(user.getNickName());
        }
        if(user.getPhone() != null){
            u.setPhone(user.getPhone());
        }
        if(user.getEmail() != null){
            u.setEmail(user.getEmail());
        }
        if(user.getPosition() != null){
            u.setPosition(user.getPosition());
        }
        userRepository.save(u);
        return new ResponseEntity<User>(u ,HttpStatus.OK);
    }

    @DeleteMapping("/employee/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        User u = userRepository.findById(Long.parseLong(id));
        if(u == null) {
            return new ResponseEntity<HttpError>(new HttpError(404, "员工不存在"),HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(Long.parseLong(id));
        JSONObject json = new JSONObject();
        json.put("result", "ok");
        return new ResponseEntity<JSONObject>(json ,HttpStatus.OK);
    }

    @PostMapping("/openAuth")
    public ResponseEntity<?> openAuth(@RequestBody JSONObject request) throws IOException{
        String employeeId = null;
        String phone = null;
        String email = null;
        if(request.get("employeeId") != null){
            employeeId = request.get("employeeId").toString();
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "没有上送工号"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("phone") != null){
            phone = request.get("phone").toString();
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "没有上送手机号"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("email") != null){
            email = request.get("email").toString();
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "没有上送邮箱"),HttpStatus.BAD_REQUEST);
        }
        List<LDAPUser> us = lDAPUserRepository.findByCns(employeeId);
        if(us == null || us.size() == 0 || us.get(0).getJcemployeeleavedate() != null){
            return new ResponseEntity<HttpError>(new HttpError(401, "您不是在职员工"),HttpStatus.BAD_REQUEST);
        }
        User currentUser = userRepository.findByEmployeeId(employeeId);
        if(currentUser == null){
            currentUser = new User();
            currentUser.setUsername(phone);
            currentUser.setPassword(bCryptPasswordEncoder.encode("12345"));
            currentUser.setAutoEmail(false);
            currentUser.setEmail(email);
            currentUser.setNickName(us.get(0).getName());
            currentUser.setCreated(new Date());
            currentUser.setEmployeeId(request.get("employeeId").toString());
            currentUser.setPhone(request.get("phone").toString());
            Employee ep = employeeRepository.findAllByEmployeeId(employeeId);
            if(ep != null){
                currentUser.setOrg(ep.getOrgName());
                currentUser.setOrgCode(ep.getOrgCode());
                currentUser.setOrgTree(ep.getOrgTree());
            }
            currentUser = userRepository.save(currentUser);
        }

        if(currentUser.getUdeskId() == null) {
            HashMap<String, Object> udeskCustomer = new HashMap();
            HashMap<String, String> customer = new HashMap();
            customer.put("nick_name", us.get(0).getName());
            customer.put("email", "ticket"+currentUser.getId()+"@jc.com");
            udeskCustomer.put("customer", customer);
            String url = generateUrl("open_api_v1/customers");
            String r = HttpUtil.sendPost(url, JSON.toJSONString(udeskCustomer));
            JSONObject c = JSON.parseObject(r);
            if (c.get("customer") != null) {
                JSONObject nc = JSON.parseObject(c.get("customer").toString());
                String uId = nc.get("id").toString();
                currentUser.setUdeskId(uId);
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
        return new ResponseEntity<JSONObject>(result,HttpStatus.OK);
    }

    @PostMapping("/checkToken")
    public ResponseEntity<?> checkToken(@RequestBody JSONObject request) {
        if(request.get("accessToken") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "没有token"),HttpStatus.BAD_REQUEST);
        }
        AccessToken token = accessTokenRepository.findByAccessTokenEqualsAndExpireAfter(request.get("accessToken").toString(), new Date());
        if(token == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "不是有效的令牌"),HttpStatus.BAD_REQUEST);
        }else{
            return new ResponseEntity<AccessToken>(token,HttpStatus.OK);
        }
    }

    @PostMapping("/wechatBind")
    public ResponseEntity<?> wechatBind(@RequestBody JSONObject request) throws IOException{
        String employeeId = null;
        String phone = null;
        String code = null;
        String openId = null;
        if(request.get("employeeId") != null){
            employeeId = request.get("employeeId").toString();
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "没有工号"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("phone") != null){
            phone = request.get("phone").toString();
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "没有手机号"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("code") != null){
            code = request.get("code").toString();
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "没有验证码"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("openId") != null){
            openId = request.get("openId").toString();
        }else{
            System.out.println("微信code");
            return new ResponseEntity<HttpError>(new HttpError(400, "微信code"),HttpStatus.BAD_REQUEST);
        }
        AuthCode authCode = authCodeRepository.findByPhoneAndCodeAndExpireAfter(phone, code, new Date());
        if(authCode == null) {
            System.out.println("动态验证码不正确或已过期");
            return new ResponseEntity<HttpError>(new HttpError(401, "动态验证码不正确或已过期"),HttpStatus.BAD_REQUEST);
        }
        List<LDAPUser> us = lDAPUserRepository.findByCns(employeeId);
        if(us == null || us.size() == 0 || us.get(0).getJcemployeeleavedate() != null){
            System.out.println("您不是在职员工");
            return new ResponseEntity<HttpError>(new HttpError(401, "您不是在职员工"),HttpStatus.BAD_REQUEST);
        }
        User currentUser = userRepository.findByEmployeeId(employeeId);
        boolean createFlag = false;
        if(currentUser == null) {
            currentUser = new User();
            currentUser.setUsername(openId);
            currentUser.setPassword(bCryptPasswordEncoder.encode("12345"));
            currentUser.setAutoEmail(true);
            currentUser.setScore(200);
            currentUser.setCreated(new Date());
            createFlag = true;
            Employee ep = employeeRepository.findAllByEmployeeId(employeeId);
            if(ep != null){
                currentUser.setOrg(ep.getOrgName());
                currentUser.setOrgCode(ep.getOrgCode());
                currentUser.setOrgTree(ep.getOrgTree());
            }
        }else{
            if(currentUser.getOpenId() == null){
                createFlag = true;
                currentUser.setScore(200);
            }else{
                createFlag = false;
            }
        }

        weixin.popular.bean.user.User u = UserAPI.userInfo(getAccessToken(), openId);
        JSONObject profile = JSON.parseObject(JSON.toJSONString(u));
        System.out.println(profile);
        currentUser.setOpenId(openId);
        currentUser.setNickName(us.get(0).getName());
        currentUser.setEmail(us.get(0).getMail());
        currentUser.setImageUrl(profile.get("headimgurl") == null ? "" : profile.get("headimgurl").toString());
        currentUser.setEmployeeId(employeeId);
        currentUser.setPhone(phone);


        if(us.get(0).getMail() != null){
            String url = generateUrl("open_api_v1/agents");
            String agents = HttpUtil.sendGet(url);
            JSONObject json = JSONObject.parseObject(agents);
            if(json.get("code").toString().equals("1000")){
                JSONArray aList = JSONObject.parseArray(json.get("agents").toString());
                for(int i=0; i<aList.size(); i++){
                    JSONObject agent = aList.getJSONObject(i);
                    if(agent.get("email") != null){
                        if(agent.get("email").toString().equals(us.get(0).getMail())){
                            currentUser.setAgentId(agent.get("id").toString());
                        }
                    }
                }
            }
        }
        currentUser =  userRepository.save(currentUser);

        if(createFlag == true){
            ScoreHistory scoreHistory = new ScoreHistory();
            scoreHistory.setType("add");
            scoreHistory.setUserId(currentUser.getId());
            scoreHistory.setRemark("绑定注册");
            scoreHistory.setScore(200);
            scoreHistory.setCreated(new Date());
            scoreHistoryRepository.save(scoreHistory);
        }

        if(currentUser.getUdeskId() == null) {
            HashMap<String, Object> udeskCustomer = new HashMap();
            HashMap<String, String> customer = new HashMap();
            customer.put("nick_name", currentUser.getNickName());
            customer.put("email", "ticket" + currentUser.getId() + "@jc.com");
            udeskCustomer.put("customer", customer);
            String url = generateUrl("open_api_v1/customers");
            String r = HttpUtil.sendPost(url, JSON.toJSONString(udeskCustomer));
            JSONObject c = JSON.parseObject(r);
            if (c.get("customer") != null) {
                JSONObject nc = JSON.parseObject(c.get("customer").toString());
                String uId = nc.get("id").toString();
                currentUser.setUdeskId(uId);
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
        if(createFlag == true) {
                TemplateMessage message = new TemplateMessage();
                message.setTemplate_id(env.getProperty("wechat.notification.bind"));
                message.setTouser(currentUser.getOpenId());
                LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
                d.put("first", new TemplateMessageItem("绑定注册成功", "#000000"));
                d.put("keyword1", new TemplateMessageItem(currentUser.getEmployeeId(), "#000000"));
                d.put("keyword2", new TemplateMessageItem(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()), "#000000"));
                d.put("remark", new TemplateMessageItem("姓名： "+currentUser.getNickName(), "#000000"));
                message.setData(d);
                MessageAPI.messageTemplateSend(getAccessToken(), message);

            TemplateMessage message1 = new TemplateMessage();
            message1.setTemplate_id(env.getProperty("wechat.notification.score"));
            message1.setTouser(currentUser.getOpenId());
            LinkedHashMap<String, TemplateMessageItem> d1 = new LinkedHashMap();
            d1.put("first", new TemplateMessageItem("获得积分通知", "#000000"));
            d1.put("keyword1", new TemplateMessageItem(currentUser.getNickName(), "#000000"));
            d1.put("keyword2", new TemplateMessageItem(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()), "#000000"));
            d1.put("keyword3", new TemplateMessageItem("+200", "#000000"));
            d1.put("keyword4", new TemplateMessageItem(currentUser.getScore()+"", "#000000"));
            d1.put("keyword5", new TemplateMessageItem("绑定注册", "#000000"));
            d1.put("remark", new TemplateMessageItem("可使用积分到商城兑换商品", "#000000"));
            message1.setData(d1);
            MessageAPI.messageTemplateSend(getAccessToken(), message1);
        }

        result.put("accessToken", newTokenString);
        result.put("userId", currentUser.getId());
        result.put("udeskId", currentUser.getUdeskId());
        result.put("expire", newToken.getExpire());
        return new ResponseEntity<JSONObject>(result,HttpStatus.OK);
    }



    @PostMapping("/wechatOpenId")
    public ResponseEntity<?> wechatOpenId(@RequestBody JSONObject request){
        SnsToken token = SnsAPI.oauth2AccessToken(env.getProperty("wechat.appId"), env.getProperty("wechat.appSecret"), request.get("code").toString());
        if(token == null || token.getAccess_token() == null || token.getOpenid() == null) {
            return new ResponseEntity<HttpError>(new HttpError(401, "code无效") ,HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<SnsToken>(token,HttpStatus.OK);
    }

    @PostMapping("/wechatAuth")
    public ResponseEntity<?> wechatAuth(@RequestBody JSONObject request) throws IOException{
        if(request.get("openId") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "openId不存在") ,HttpStatus.UNAUTHORIZED);
        }
        String openId = request.get("openId").toString();
        User currentUser = userRepository.findByOpenId(openId);
        if(currentUser == null) {
            return new ResponseEntity<HttpError>(new HttpError(401, "用户不存在") ,HttpStatus.UNAUTHORIZED);
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
        return new ResponseEntity<JSONObject>(result, HttpStatus.OK);
    }

    public String generateUrl(String url){
        String email = env.getProperty("udesk.email");
        Date date = new Date();
        Long timeStamp = date.getTime();
        String token = env.getProperty("udesk.token");
        String sign = DigestUtils.sha1Hex(email+"&"+token+"&"+timeStamp);
        return env.getProperty("udesk.url").concat(url+"?email="+email+"&timestamp="+timeStamp+"&sign="+sign);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        User usr = userRepository.findById(userId);
        if(usr == null) {
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        RegisterHistory registerHistory = new RegisterHistory();
        registerHistory.setCreated(new Date());
        registerHistory.setUserId(userId);
        registerHistoryRepository.save(registerHistory);

        Register register = registerRepository.findByUserId(userId);
        Date today = new Date();
        if(register == null){
            register = new Register();
            register.setContinuousRegister(1);
            register.setCreated(today);
            register.setLastRegister(today);
            register.setUserId(userId);
            register.setReward7(false);
            register.setReward14(false);
            register.setReward21(false);
        }else{

            Calendar aCalendar = Calendar.getInstance();
            aCalendar.setTime(register.getLastRegister());
            int day1 = aCalendar.get(Calendar.DAY_OF_YEAR);
            aCalendar.setTime(today);
            int day2 = aCalendar.get(Calendar.DAY_OF_YEAR);
            if(day2 -day1 == 1){
                register.setContinuousRegister(register.getContinuousRegister()+1);
            }else{
                register.setContinuousRegister(1);
            }
            System.out.println(day2 -day1);
            register.setLastRegister(today);
        }

        ScoreHistory scoreHistory = new ScoreHistory();
        scoreHistory.setType("add");
        scoreHistory.setUserId(userId);
        scoreHistory.setRemark("签到");
        scoreHistory.setScore(5);
        scoreHistory.setCreated(today);
        scoreHistoryRepository.save(scoreHistory);

        usr.setScore(usr.getScore() + 5);
        userRepository.save(usr);
        registerRepository.save(register);
        return new ResponseEntity<Register>(register, HttpStatus.OK);
    }

    @GetMapping("/register")
    public ResponseEntity<?> getRegister(HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        User usr = userRepository.findById(userId);
        if(usr == null) {
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        Register register = registerRepository.findByUserId(userId);
        return new ResponseEntity<Register>(register, HttpStatus.OK);
    }

    @GetMapping("/registerHistory")
    public ResponseEntity<?> getRegisterHistory(@RequestParam(required=false, defaultValue = "") String start, @RequestParam(required=false, defaultValue = "") String end, HttpServletRequest r1) throws ParseException {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        User usr = userRepository.findById(userId);
        if(usr == null) {
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        SimpleDateFormat simFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date s = simFormat.parse(start);
        Date e = simFormat.parse(end);
        List<RegisterHistory> rhs = registerHistoryRepository.findAllByUserIdAndCreatedBetween(userId, s, e);
        return new ResponseEntity<List<RegisterHistory>>(rhs, HttpStatus.OK);
    }

    @PostMapping("/reward")
    public ResponseEntity<?> reward(@RequestBody JSONObject request, HttpServletRequest r1) {
        String type = request.get("type").toString();
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        User usr = userRepository.findById(userId);
        if(usr == null) {
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        Register register = registerRepository.findByUserId(userId);
        if(register == null){
            return new ResponseEntity<HttpError>(new HttpError(403, "不满足兑换条件"),HttpStatus.UNAUTHORIZED);
        }
        if(type.equals("reward7")){
            if(register.getReward7() == true){
                return new ResponseEntity<HttpError>(new HttpError(403, "已经兑换"),HttpStatus.UNAUTHORIZED);
            }
            register.setReward7(true);
            usr.setScore(usr.getScore()+10);
        }
        if(type.equals("reward14")){
            if(register.getReward14() == true){
                return new ResponseEntity<HttpError>(new HttpError(403, "已经兑换"),HttpStatus.UNAUTHORIZED);
            }
            register.setReward14(true);
            usr.setScore(usr.getScore()+10);
        }
        if(type.equals("reward21")){
            if(register.getReward21() == true){
                return new ResponseEntity<HttpError>(new HttpError(403, "已经兑换"),HttpStatus.UNAUTHORIZED);
            }
            register.setReward21(true);
            usr.setScore(usr.getScore()+10);
        }

        registerRepository.save(register);
        userRepository.save(usr);
        ScoreHistory scoreHistory = new ScoreHistory();
        scoreHistory.setType("add");
        scoreHistory.setUserId(userId);
        scoreHistory.setRemark("连续签到奖励");
        scoreHistory.setScore(10);
        scoreHistory.setCreated(new Date());
        scoreHistoryRepository.save(scoreHistory);
        return new ResponseEntity<Register>(register, HttpStatus.OK);
    }



}

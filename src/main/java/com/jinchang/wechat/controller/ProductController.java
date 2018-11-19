package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.*;
import com.jinchang.wechat.repository.*;
import com.jinchang.wechat.util.HttpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import weixin.popular.api.MessageAPI;
import weixin.popular.api.TokenAPI;
import weixin.popular.bean.message.templatemessage.TemplateMessage;
import weixin.popular.bean.message.templatemessage.TemplateMessageItem;
import weixin.popular.bean.token.Token;

import javax.servlet.http.HttpServletRequest;
import java.awt.print.Pageable;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected ProductRepository productRepository;

    @Autowired
    protected RedeemHistoryRepository redeemHistoryRepository;

    @Autowired
    protected ScoreHistoryRepository scoreHistoryRepository;

    @Autowired
    private Environment env;

    @Autowired
    protected WechatAccessTokenRepository wechatAccessTokenRepository;

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

    @GetMapping("/count")
    public ResponseEntity<?> getCount(@RequestParam(required=false, defaultValue = "") String name, @RequestParam(required=false, defaultValue = "") String status, @RequestParam(required=false, defaultValue="") String saleStatus, @RequestParam(required=false, defaultValue="") String start, @RequestParam(required=false, defaultValue="") String end, @RequestParam(required=false) String id) throws ParseException {
        if(status.equals("all")) { status = ""; }
        if(saleStatus.equals("all")) { saleStatus = ""; }
        long productId = 0;
        if(id != null){
            productId = Long.parseLong(id);
        }
        Date d1 = null;
        Date d2 = null;
        System.out.println("page");
        if(!start.equals("")) { d1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(start); }
        if(!end.equals( "")) { d2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(end); }
        int r = productRepository.countProducts(name, status, saleStatus, d1, d2, productId);
        JSONObject result = new JSONObject();
        result.put("count", r);
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<?> getList(@RequestParam(required=false, defaultValue = "") String name, @RequestParam(required=false, defaultValue = "") String status, @RequestParam(required=false, defaultValue="") String saleStatus, @RequestParam(required=false, defaultValue="") String start, @RequestParam(required=false, defaultValue="") String end, @RequestParam(required=false) int page, @RequestParam(required=false) String id) throws ParseException {
        if(status.equals("all")) { status = ""; }
        if(saleStatus.equals("all")) { saleStatus = ""; }
        long productId = 0;
        if(id != null){
            productId = Long.parseLong(id);
        }
        Date d1 = null;
        Date d2 = null;
        if(page > 0) { page -= 1;}
        if(!start.equals("")) { d1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(start); }
        if(!end.equals( "")) { d2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(end); }
        Page<Product> r = productRepository.findPageProducts(name, status, saleStatus, d1, d2, productId, PageRequest.of(page, 10, Sort.Direction.DESC, "last_modify"));
        JSONObject result = new JSONObject();
        result.put("productList", r.getContent());
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("/clientList")
    public ResponseEntity<?> clientList() throws ParseException {
        Date now = new Date();
        List<Product> productList = productRepository.findAllByStatusAndStartBeforeAndEndAfterAndSaleStatusAndDeletedOrderByCreatedDesc("confirmed", now, now, "up", false);
        JSONObject result = new JSONObject();
        result.put("productList", productList);
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable String id, HttpServletRequest r1) throws IOException {
       Product product = productRepository.findById(Long.parseLong(id));
        return new ResponseEntity<Product>(product ,HttpStatus.OK);
    }

    @GetMapping("/redeem/{id}")
    public ResponseEntity<?> getRedeemDetail(@PathVariable String id, HttpServletRequest r1) throws IOException {
        RedeemHistory redeem = redeemHistoryRepository.findById(Long.parseLong(id));
        return new ResponseEntity<RedeemHistory>(redeem ,HttpStatus.OK);
    }

    @PostMapping("/batchUpdate")
    public ResponseEntity<?> batchUpdate(@RequestBody JSONObject request) throws IOException {
        String ids = request.get("ids").toString();
        String status = null;
        String saleStatus = null;
        boolean deleted = false;
        if(request.get("status") != null){
            status = request.get("status").toString();
            if(status == "confirmed"){
                saleStatus = "up";
            }
        }
        if(request.get("saleStatus") != null){
            saleStatus = request.get("saleStatus").toString();
        }
        if(request.get("deleted") != null){
            deleted = Boolean.parseBoolean(request.get("deleted").toString());
        }
        String[] idList = ids.split(",");
        Collection<Long> is = new ArrayList<>();
        for(int i=0; i<idList.length; i++){
            is.add(Long.parseLong(idList[i]));
        }
        List<Product> products = productRepository.findAllByIdIn(is);
        Date now = new Date();
        for(int j =0; j<products.size(); j++){
            products.get(j).setLast_modify(now);
            if(status != null){
                products.get(j).setStatus(status);
            }
            if(saleStatus != null){
                products.get(j).setSaleStatus(saleStatus);
            }
            if(deleted == true){
                products.get(j).setDeleted(true);
            }
        }
        productRepository.saveAll(products);
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> upsertProduct(@RequestBody JSONObject request) throws ParseException{
        Product product = new Product();
        if(request.get("id") != null){
            product = productRepository.findById(Long.parseLong(request.get("id").toString()));
            product.setStatus("draft");

        }else{
            product.setCreated(new Date());
            product.setStatus("draft");
            product.setSaleStatus("down");
            product.setDeleted(false);
        }
        product.setLast_modify(new Date());
        if(request.get("abbreviation") != null){
            product.setAbbreviation(request.get("abbreviation").toString());
        }
        if(request.get("name") != null) {
            product.setName(request.get("name").toString());
        }
        if(request.get("simpleImageUrl") != null){
            product.setSimpleImageUrl(request.get("simpleImageUrl").toString());
        }
        if(request.get("detailImageUrl") != null){
            product.setDetailImageUrl(request.get("detailImageUrl").toString());
        }
        if(request.get("start") != null){
            product.setStart(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(request.get("start").toString()));
        }
        if(request.get("end") != null){
            product.setEnd(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(request.get("end").toString()));
        }
        if(request.get("score") != null){
            product.setScore(Float.parseFloat(request.get("score").toString()));
        }
        if(request.get("price") != null){
            product.setPrice(Float.parseFloat(request.get("price").toString()));
        }
        if(request.get("store") != null){
            if(request.get("store").toString().equals("-")){
                product.setStore(-100);
            }else{
                product.setStore(Integer.parseInt(request.get("store").toString()));
            }
        }
        if(request.get("remark") != null){
            product.setRemark(request.get("remark").toString());
        }
        Product result = productRepository.save(product);
        return new ResponseEntity<Product>(result ,HttpStatus.OK);
    }

    @PostMapping("/redeem")
    public ResponseEntity<?> redeem(@RequestBody JSONObject request) {
        String userName = null;
        String userPhone = null;
        long userId;
        long productId;
        if (request.get("userName") == null) {
            return new ResponseEntity<HttpError>(new HttpError(400, "没有兑换人姓名"), HttpStatus.BAD_REQUEST);
        }
        if (request.get("userPhone") == null) {
            return new ResponseEntity<HttpError>(new HttpError(400, "没有兑换人手机"), HttpStatus.BAD_REQUEST);
        }
        if (request.get("userId") == null) {
            return new ResponseEntity<HttpError>(new HttpError(400, "没有兑换人id"), HttpStatus.BAD_REQUEST);
        }
        if (request.get("productId") == null) {
            return new ResponseEntity<HttpError>(new HttpError(400, "没有兑换物品id"), HttpStatus.BAD_REQUEST);
        }
        userName = request.get("userName").toString();
        userPhone = request.get("userPhone").toString();
        userId = Long.parseLong(request.get("userId").toString());
        productId = Long.parseLong(request.get("productId").toString());

        User u = userRepository.findById(userId);
        if (u == null) {
            return new ResponseEntity<HttpError>(new HttpError(400, " 用户不存在"), HttpStatus.BAD_REQUEST);
        }

        Product p = productRepository.findById(productId);
        if (p == null) {
            return new ResponseEntity<HttpError>(new HttpError(400, " 商品不存在"), HttpStatus.BAD_REQUEST);
        }

        RedeemHistory his = new RedeemHistory();
        his.setUserId(u.getId());
        his.setUserName(userName);
        his.setUserPhone(userPhone);
        his.setProductId(p.getId());
        his.setPrice(p.getScore());
        his.setStatus("accepted");
        his.setCreated(new Date());
        his.setImageUrl(p.getSimpleImageUrl());
        his.setProductName(p.getName());
        his.setNo("RD"+new Date().getTime());
        his.setEmployeeId(u.getEmployeeId());
        his.setUserOrg(u.getOrgTree());

        if (u.getScore() < p.getScore()) {
            return new ResponseEntity<HttpError>(new HttpError(400, " 积分不足"), HttpStatus.BAD_REQUEST);
        }

        if(p.getStore() != -100){
            if(p.getStore() < 1){
                return new ResponseEntity<HttpError>(new HttpError(400, " 库存不足"), HttpStatus.BAD_REQUEST);
            }
            p.setStore(p.getStore() - 1);
            productRepository.save(p);
        }

        redeemHistoryRepository.save(his);
        u.setScore(u.getScore() - p.getScore());
        userRepository.save(u);

        ScoreHistory scoreHistory = new ScoreHistory();
        scoreHistory.setType("reduce");
        scoreHistory.setUserId(u.getId());
        scoreHistory.setRemark("兑换礼品");
        scoreHistory.setScore(p.getScore());
        scoreHistory.setCreated(new Date());
        scoreHistoryRepository.save(scoreHistory);

        TemplateMessage message = new TemplateMessage();
        message.setTemplate_id(env.getProperty("wechat.notification.redeem"));
        message.setTouser(u.getOpenId());
        LinkedHashMap<String, TemplateMessageItem> d = new LinkedHashMap();
        d.put("first", new TemplateMessageItem("兑换成功通知", "#000000"));
        d.put("keyword1", new TemplateMessageItem(his.getNo(), "#000000"));
        d.put("keyword2", new TemplateMessageItem(his.getProductName(), "#000000"));
        d.put("keyword3", new TemplateMessageItem("1", "#000000"));
        d.put("keyword4", new TemplateMessageItem(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(his.getCreated()), "#000000"));
        d.put("remark", new TemplateMessageItem("", "#000000"));
        message.setData(d);
        MessageAPI.messageTemplateSend(getAccessToken(), message);

        TemplateMessage message1 = new TemplateMessage();
        message1.setTemplate_id(env.getProperty("wechat.notification.score"));
        message1.setTouser(u.getOpenId());
        LinkedHashMap<String, TemplateMessageItem> d1 = new LinkedHashMap();
        d1.put("first", new TemplateMessageItem("积分使用通知", "#000000"));
        d1.put("keyword1", new TemplateMessageItem(u.getNickName(), "#000000"));
        d1.put("keyword2", new TemplateMessageItem(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()), "#000000"));
        d1.put("keyword3", new TemplateMessageItem("-"+p.getScore(), "#000000"));
        d1.put("keyword4", new TemplateMessageItem(u.getScore()+"", "#000000"));
        d1.put("keyword5", new TemplateMessageItem("商品兑换", "#000000"));
        d1.put("remark", new TemplateMessageItem("可使用积分到商城兑换商品", "#000000"));
        message1.setData(d1);
        MessageAPI.messageTemplateSend(getAccessToken(), message1);

        return new ResponseEntity<RedeemHistory>(his, HttpStatus.OK);
    }

    @GetMapping("/redeemList")
    public ResponseEntity<?> getRedeemList(HttpServletRequest r1) throws IOException {
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        List<RedeemHistory> rds = redeemHistoryRepository.findAllByUserIdOrderByCreatedDesc(userId);
        return new ResponseEntity<List<RedeemHistory>>(rds, HttpStatus.OK);
    }

    @GetMapping("/redeem/count")
    public ResponseEntity<?> getRedeemCount(@RequestParam(required=false, defaultValue = "") String org, @RequestParam(required=false, defaultValue = "") String employeeId, @RequestParam(required=false, defaultValue="") String productName, @RequestParam(required=false, defaultValue="") String start, @RequestParam(required=false, defaultValue="") String end) throws ParseException {
        if(org.equals("全部")){
            org = "";
        }else{
            org="%"+org+"%";
        }
        Date d1 = null;
        Date d2 = null;
        if(!start.equals("")) { d1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(start); }
        if(!end.equals( "")) { d2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(end); }
        int r = redeemHistoryRepository.countRedeems(org, employeeId, productName, d1, d2);
        JSONObject result = new JSONObject();
        result.put("count", r);
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("/redeem/list")
    public ResponseEntity<?> getRedeems(@RequestParam(required=false, defaultValue = "") String org, @RequestParam(required=false, defaultValue = "") String employeeId, @RequestParam(required=false, defaultValue="") String productName, @RequestParam(required=false, defaultValue="") String start, @RequestParam(required=false, defaultValue="") String end, @RequestParam(required=false) int page) throws ParseException {
        if(org.equals("全部")){
            org = "";
        }else{
            org="%"+org+"%";
        }
        Date d1 = null;
        Date d2 = null;

        if(!start.equals("")) { d1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(start); }
        if(!end.equals( "")) { d2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(end); }
        if(page > 0) { page -= 1;}
        Page<RedeemHistory> r = redeemHistoryRepository.findPageRedeems(org, employeeId, productName, d1, d2, PageRequest.of(page, 10, Sort.Direction.DESC, "created"));
        JSONObject result = new JSONObject();
        result.put("redeemList", r.getContent());
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("/redeem/all")
    public ResponseEntity<?> getAllRedeems(@RequestParam(required=false, defaultValue = "") String org, @RequestParam(required=false, defaultValue = "") String employeeId, @RequestParam(required=false, defaultValue="") String productName, @RequestParam(required=false, defaultValue="") String start, @RequestParam(required=false, defaultValue="") String end) throws ParseException {
        if(org.equals("全部")){
            org = "";
        }else{
            org="%"+org+"%";
        }
        Date d1 = null;
        Date d2 = null;
        if(!start.equals("")) { d1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(start); }
        if(!end.equals( "")) { d2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(end); }
        List<RedeemHistory> r = redeemHistoryRepository.findAllRedeemsList(org, employeeId, productName, d1, d2);
        JSONObject result = new JSONObject();
        result.put("redeemList", r);
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("/scoreList")
    public ResponseEntity<?> getScoreList(HttpServletRequest r1) throws IOException {
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        List<ScoreHistory> rds = scoreHistoryRepository.findAllByUserIdOrderByCreatedDesc(userId);
        return new ResponseEntity<List<ScoreHistory>>(rds, HttpStatus.OK);
    }
}

package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.FeedBack;
import com.jinchang.wechat.entity.HttpError;
import com.jinchang.wechat.entity.Support;
import com.jinchang.wechat.entity.User;
import com.jinchang.wechat.repository.CompanyRepository;
import com.jinchang.wechat.repository.FeedbackRepository;
import com.jinchang.wechat.repository.SupportRepository;
import com.jinchang.wechat.repository.UserRepository;
import com.jinchang.wechat.util.HttpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    protected FeedbackRepository feedbackRepository;

    @Autowired
    protected SupportRepository supportRepository;

    @Autowired
    protected UserRepository userRepository;

    @PostMapping("")
    public ResponseEntity<?> addFeedback(@RequestBody JSONObject request, HttpServletRequest r1) throws ParseException{
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        FeedBack feedback = new FeedBack();
        feedback.setTitle(request.get("title").toString());
        feedback.setContent(request.get("content").toString());
        feedback.setCategory(request.get("category").toString());
        feedback.setCreated(new Date());
        feedback.setHide(Boolean.parseBoolean(request.get("hide").toString()));
        feedback.setOpen(Boolean.parseBoolean(request.get("open").toString()));
        feedback.setUserId(userId);
        feedback.setSupport(0);
        User u = userRepository.findById(userId);
        feedback.setUserName(u.getNickName());
        if(u.getImageUrl() != null){
            feedback.setUserImage(u.getImageUrl());
        }
        feedbackRepository.save(feedback);
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result , HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getList( @RequestParam(required=false) int page, @RequestParam(required=false) String order, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        System.out.println("getList");

        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        List<FeedBack> result = feedbackRepository.findAllByUserIdOrOpen(userId, true,  PageRequest.of(page-1, 10, Sort.Direction.DESC, order));
        System.out.println(userId);
        System.out.println(result.size());
        for(int i=0; i<result.size(); i++){
            Support support = supportRepository.findByUserIdAndFeedbackId(userId, result.get(i).getId());
            if(support != null){
                result.get(i).setAgree(true);
            }else{
                result.get(i).setAgree(false);
            }
        }
        return new ResponseEntity<List<FeedBack>>(result , HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCount(HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        int count = feedbackRepository.countByUserIdOrOpen(userId, true);
        JSONObject result = new JSONObject();
        result.put("count", count);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/myList")
    public ResponseEntity<?> getMyList( @RequestParam(required=false) int page, @RequestParam(required=false) String order, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        List<FeedBack> result = feedbackRepository.findAllByUserId(userId, PageRequest.of(page-1, 10, Sort.Direction.DESC, order));
        for(int i=0; i<result.size(); i++){
            Support support = supportRepository.findByUserIdAndFeedbackId(userId, result.get(i).getId());
            if(support != null){
                result.get(i).setAgree(true);
            }else{
                result.get(i).setAgree(false);
            }
        }
        return new ResponseEntity<List<FeedBack>>(result , HttpStatus.OK);
    }

    @GetMapping("/countMyList")
    public ResponseEntity<?> getCountMyList(HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        int count = feedbackRepository.countByUserId(userId);
        JSONObject result = new JSONObject();
        result.put("count", count);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/support")
    public ResponseEntity<?> support(@RequestBody JSONObject request, HttpServletRequest r1) throws ParseException{
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        long feedbckId = Long.parseLong(request.get("id").toString());
        FeedBack fb = feedbackRepository.findById(feedbckId);
        fb.setSupport(fb.getSupport() + 1);
        feedbackRepository.save(fb);
        Support support = new Support();
        support.setCreated(new Date());
        support.setFeedbackId(feedbckId);
        support.setUserId(userId);
        supportRepository.save(support);
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result , HttpStatus.OK);
    }

    @PostMapping("/unSupport")
    public ResponseEntity<?> unSupport(@RequestBody JSONObject request, HttpServletRequest r1) throws ParseException{
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        long feedbackId = Long.parseLong(request.get("id").toString());
        Support p = supportRepository.findByUserIdAndFeedbackId(userId, feedbackId);
        if(p != null){
            supportRepository.deleteById(p.getId());
            FeedBack fb = feedbackRepository.findById(feedbackId);
            fb.setSupport(fb.getSupport() - 1);
            feedbackRepository.save(fb);
        }
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result , HttpStatus.OK);
    }

    @GetMapping("/allList")
    public ResponseEntity<?> getAllList(@RequestParam(required=false, defaultValue = "") String filter, @RequestParam(required=true) String category, @RequestParam(required=false) int page, @RequestParam(required=false) String order, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        if(category.equals("全部")){
            category = "";
        }
        Page<FeedBack> result = feedbackRepository.findPageFeedback(filter, category,  PageRequest.of(page-1, 10, Sort.Direction.DESC, "created"));
        return new ResponseEntity<List<FeedBack>>(result.getContent() , HttpStatus.OK);
    }

    @GetMapping("/allCount")
    public ResponseEntity<?> getAllCount(@RequestParam(required=false, defaultValue = "") String filter, @RequestParam(required=true) String category, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        if(category.equals("全部")){
            category = "";
        }
        int count = feedbackRepository.countFeedback(filter, category);
        JSONObject result = new JSONObject();
        result.put("count", count);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

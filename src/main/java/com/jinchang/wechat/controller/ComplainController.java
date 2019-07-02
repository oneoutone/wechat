package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.*;
import com.jinchang.wechat.repository.ComplainRepository;
import com.jinchang.wechat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/complain")
public class ComplainController {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected ComplainRepository complainRepository;

    @PostMapping("")
    public ResponseEntity<?> addComplain(@RequestBody JSONObject request, HttpServletRequest r1) throws ParseException {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"), HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        Complain complain = new Complain();
        complain.setCategory(request.get("category").toString());
        complain.setTitle(request.get("title").toString());
        complain.setContent(request.get("content").toString());
        complain.setUserId(userId);
        complain.setCreated(new Date());
        complain.setReleased("false");
        complainRepository.save(complain);
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result , HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getList( @RequestParam(required=false) int page, HttpServletRequest r1) {
        Page<Complain> result = complainRepository.findAll(PageRequest.of(page-1, 10, Sort.Direction.DESC, "created"));
        return new ResponseEntity<List<Complain>>(result.getContent() , HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCount(HttpServletRequest r1) {
        long count = complainRepository.count();
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
        List<Complain> result = complainRepository.findAllByUserId(userId, PageRequest.of(page-1, 10, Sort.Direction.DESC, "created"));
        return new ResponseEntity<List<Complain>>(result , HttpStatus.OK);
    }

    @GetMapping("/countMyList")
    public ResponseEntity<?> getCountMyList(HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        int count = complainRepository.countByUserId(userId);
        JSONObject result = new JSONObject();
        result.put("count", count);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/allList")
    public ResponseEntity<?> getAllList(@RequestParam(required=false, defaultValue = "") String filter, @RequestParam(required=true) String category, @RequestParam(required=false) String released, @RequestParam(required=false) int page, @RequestParam(required=false) String order, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        if(category.equals("全部")){
            category = "";
        }
        if(released.equals("all")){
            released = "";
        }
        Page<Complain> result = complainRepository.findPageComplain(filter, category,  released, PageRequest.of(page-1, 10, Sort.Direction.DESC, "created"));
        return new ResponseEntity<List<Complain>>(result.getContent() , HttpStatus.OK);
    }

    @GetMapping("/allCount")
    public ResponseEntity<?> getAllCount(@RequestParam(required=false, defaultValue = "") String filter, @RequestParam(required=true) String category, @RequestParam(required=false) String released, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        if(category.equals("全部")){
            category = "";
        }
        if(released.equals("all")){
            released = "";
        }
        int count = complainRepository.countComplain(filter, category, released);
        JSONObject result = new JSONObject();
        result.put("count", count);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("process")
    public ResponseEntity<?> process(@RequestBody JSONObject request, HttpServletRequest r1) throws ParseException {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"), HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        Complain complain = complainRepository.findById(Long.parseLong(request.get("id").toString()));
        if(complain == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "投诉不存在"), HttpStatus.BAD_REQUEST);
        }
        complain.setReleased("true");
        complain.setReleaseDate(new Date());
        complain.setResultTitle(request.get("resultTitle").toString());
        complain.setResult(request.get("result").toString());
        complainRepository.save(complain);
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result , HttpStatus.OK);
    }

}

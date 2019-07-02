package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.Complain;
import com.jinchang.wechat.entity.HttpError;
import com.jinchang.wechat.entity.Letter;
import com.jinchang.wechat.repository.ComplainRepository;
import com.jinchang.wechat.repository.LetterRepository;
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
@RequestMapping("/api/letter")
public class LetterController {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected LetterRepository letterRepository;

    @PostMapping("")
    public ResponseEntity<?> addFeedback(@RequestBody JSONObject request, HttpServletRequest r1) throws ParseException {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"), HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        Letter letter = new Letter();
        letter.setTitle(request.get("title").toString());
        letter.setContent(request.get("content").toString());
        letter.setUserId(userId);
        letter.setReply("false");
        letter.setCreated(new Date());
        letterRepository.save(letter);
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result , HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getList( @RequestParam(required=false) int page, HttpServletRequest r1) {
        Page<Letter> result = letterRepository.findAll(PageRequest.of(page-1, 10, Sort.Direction.DESC, "created"));
        return new ResponseEntity<List<Letter>>(result.getContent() , HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCount(HttpServletRequest r1) {
        long count = letterRepository.count();
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
        List<Letter> result = letterRepository.findAllByUserId(userId, PageRequest.of(page-1, 10, Sort.Direction.DESC, "created"));
        return new ResponseEntity<List<Letter>>(result , HttpStatus.OK);
    }

    @GetMapping("/countMyList")
    public ResponseEntity<?> getCountMyList(HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        int count = letterRepository.countByUserId(userId);
        JSONObject result = new JSONObject();
        result.put("count", count);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/allList")
    public ResponseEntity<?> getAllList(@RequestParam(required=false, defaultValue = "") String filter, @RequestParam(required=false) String reply, @RequestParam(required=false) int page, @RequestParam(required=false) String order, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        if(reply.equals("all")){
            reply = "";
        }
        Page<Letter> result = letterRepository.findPageLetter(filter,  reply, PageRequest.of(page-1, 10, Sort.Direction.DESC, "created"));
        return new ResponseEntity<List<Letter>>(result.getContent() , HttpStatus.OK);
    }

    @GetMapping("/allCount")
    public ResponseEntity<?> getAllCount(@RequestParam(required=false, defaultValue = "") String filter, @RequestParam(required=false) String reply, HttpServletRequest r1) {
        if(r1.getAttribute("currentUserId") == null){
            return new ResponseEntity<HttpError>(new HttpError(401, "员工不存在"),HttpStatus.UNAUTHORIZED);
        }
        long userId = Long.parseLong(r1.getAttribute("currentUserId").toString());
        if(reply.equals("all")){
            reply = "";
        }
        int count = letterRepository.countLetter(filter, reply);
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
        Letter letter = letterRepository.findById(Long.parseLong(request.get("id").toString()));
        if(letter == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "投诉不存在"), HttpStatus.BAD_REQUEST);
        }
        letter.setReply("true");
        letter.setResult(request.get("result").toString());
        letterRepository.save(letter);
        JSONObject result = new JSONObject();
        result.put("result", "ok");
        return new ResponseEntity<JSONObject>(result , HttpStatus.OK);
    }

}

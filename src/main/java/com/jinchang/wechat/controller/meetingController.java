package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.*;
import com.jinchang.wechat.repository.CompanyRepository;
import com.jinchang.wechat.repository.MeetingRepository;
import com.jinchang.wechat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class meetingController {

    @Autowired
    protected MeetingRepository meetingRepository;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected CompanyRepository companyRepository;

    @GetMapping("")
    public ResponseEntity<?> getList(@RequestParam(required=false, defaultValue="") String start, @RequestParam(required=false, defaultValue="") String end) throws ParseException {
        Date s = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(start);
        Date e = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(end);
        System.out.println(s);
        System.out.println(e);
        System.out.println("meeting time");
        List<Meeting> meetings = meetingRepository.findAllByStartBetween(s,e);
        return new ResponseEntity<List<Meeting>>(meetings ,HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> upsert(@RequestBody JSONObject request)  throws ParseException{
        Meeting meeting = new Meeting();
        if(request.get("id") != null){
            meeting = meetingRepository.findById(Long.parseLong(request.get("id").toString()));
        }
        if(request.get("start") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "没有开始时间"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("end") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "没有结束时间"),HttpStatus.BAD_REQUEST);
        }
        Date s = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(request.get("start").toString());
        Date e = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(request.get("end").toString());
        meeting.setStart(s);
        meeting.setEnd(e);
        if(request.get("userName") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "却少预定人"),HttpStatus.BAD_REQUEST);
        }
        meeting.setUserName(request.get("userName").toString());
        if(request.get("userId") != null){
            meeting.setUserId(Long.parseLong(request.get("userId").toString()));
        }
        if(request.get("topic") != null){
            meeting.setTopic(request.get("topic") .toString());
        }
        if(request.get("companyName") != null){
            meeting.setCompanyName(request.get("companyName").toString());
        }
        if(request.get("companyId") != null){
            meeting.setCompanyId(Long.parseLong(request.get("companyId").toString()));
        }
        if(request.get("meetingRoomName") != null){
            meeting.setMeetingRoomName(request.get("meetingRoomName").toString());
        }
        if(request.get("meetingRoomId") != null){
            meeting.setMeetingRoomId(Long.parseLong(request.get("meetingRoomId").toString()));
        }
        if(request.get("channel") != null){
            meeting.setChannel(request.get("channel").toString());
        }
        meeting.setCreated(new Date());
        if(request.get("remark") != null){
            meeting.setRemark(request.get("remark").toString());
        }
        meetingRepository.save(meeting);
        return new ResponseEntity<Meeting>(meeting ,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable String id, HttpServletRequest r1) throws IOException {
        Meeting meeting = meetingRepository.findById(Long.parseLong(id));
        return new ResponseEntity<Meeting>(meeting ,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeetingRoom(@PathVariable String id) {
        meetingRepository.deleteById(Long.parseLong(id));
        JSONObject json = new JSONObject();
        json.put("result", "ok");
        return new ResponseEntity<JSONObject>(json ,HttpStatus.OK);
    }

}

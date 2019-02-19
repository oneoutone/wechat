package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.HttpError;
import com.jinchang.wechat.entity.MeetingRoom;
import com.jinchang.wechat.entity.Product;
import com.jinchang.wechat.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meetingRooms")
public class MeetingRoomController {

    @Autowired
    protected MeetingRoomRepository meetingRoomRepository;

    @GetMapping("")
    public ResponseEntity<?> meetingRoomList() {
      List<MeetingRoom> rooms = meetingRoomRepository.findAll();
      return new ResponseEntity<List<MeetingRoom>>(rooms ,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> meetingRoomList(@PathVariable String id) {
        Optional<MeetingRoom> room = meetingRoomRepository.findById(Long.parseLong(id));
        if(room.get() != null){
            return new ResponseEntity<MeetingRoom>(room.get() ,HttpStatus.OK);
        }else{
            return new ResponseEntity<HttpError>(new HttpError(400, "会议室不存在"), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("")
    public ResponseEntity<?> upsertMeetingRoom(@RequestBody MeetingRoom room){
        MeetingRoom r = new MeetingRoom();
        if(room.getId() > 0){
            Optional<MeetingRoom> or = meetingRoomRepository.findById(room.getId());
            if(or.get() != null){
                r = or.get();
            }else{
                return new ResponseEntity<HttpError>(new HttpError(400, "会议室不存在"), HttpStatus.BAD_REQUEST);
            }
        }
        if(room.getExternalId() != null){
            r.setExternalId(room.getExternalId());
        }
        if(room.getName() != null){
            r.setName(room.getName());
        }
        if(room.getSeatNum() > 0){
            r.setSeatNum(room.getSeatNum());
        }
        meetingRoomRepository.save(r);
        return new ResponseEntity<MeetingRoom>(r ,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeetingRoom(@PathVariable String id) {
        meetingRoomRepository.deleteById(Long.parseLong(id));
        JSONObject json = new JSONObject();
        json.put("result", "ok");
        return new ResponseEntity<JSONObject>(json ,HttpStatus.OK);
    }

}

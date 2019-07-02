package com.jinchang.wechat.controller;

import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.Building;
import com.jinchang.wechat.entity.Company;
import com.jinchang.wechat.entity.HttpError;
import com.jinchang.wechat.repository.BuildingRepository;
import com.jinchang.wechat.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/building")
public class BuildingController {

    @Autowired
    protected BuildingRepository buildingRepository;

    @GetMapping("/all")
    public ResponseEntity<?> getList(){
        List<Building> buildingList = buildingRepository.findAll();
        return new ResponseEntity<List<Building>>(buildingList , HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody JSONObject request){
        if(request.get("name") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "没有楼宇名字"),HttpStatus.BAD_REQUEST);
        }
        String name = request.get("name").toString();
        Building existBuilding = buildingRepository.findByName(name);
        if(existBuilding != null){
            return new ResponseEntity<HttpError>(new HttpError(400, "该楼宇已存在"),HttpStatus.BAD_REQUEST);
        }
        Building building = new Building();
        building.setName(name);
        if(request.get("address") != null){
            building.setAddress(request.get("address").toString());
        }
        building.setCreated(new Date());
        buildingRepository.save(building);
        return new ResponseEntity<Building>(building, HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody JSONObject request){
        if(request.get("id") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "该楼宇不存在"),HttpStatus.BAD_REQUEST);
        }
        Building building = buildingRepository.findById(Long.parseLong(request.get("id").toString()));
        if(building == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "该楼宇不存在"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("name") != null){
            building.setName(request.get("name").toString());
        }
        if(request.get("address") != null){
            building.setAddress(request.get("address").toString());
        }
        buildingRepository.save(building);
        return new ResponseEntity<Building>(building, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable String id) {
        buildingRepository.deleteById(Long.parseLong(id));
        JSONObject json = new JSONObject();
        json.put("result", "ok");
        return new ResponseEntity<JSONObject>(json ,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable String id){
        Building building = buildingRepository.findById(Long.parseLong(id));
        return new ResponseEntity<Building>(building ,HttpStatus.OK);
    }
}

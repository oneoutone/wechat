package com.jinchang.wechat.controller;


import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.Organization;
import com.jinchang.wechat.repository.OrganizationRepository;
import com.jinchang.wechat.util.HttpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    protected OrganizationRepository organizationRepository;

    @GetMapping("/list")
    public ResponseEntity<?> getList() {
        List<Integer> levels= new ArrayList();
        levels.add(2);
        levels.add(3);
        List<Organization> orgs = organizationRepository.findAllByLevelIn(levels);
        return new ResponseEntity<List<Organization>>(orgs ,HttpStatus.OK);
    }

}

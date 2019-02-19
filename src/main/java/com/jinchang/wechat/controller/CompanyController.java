package com.jinchang.wechat.controller;


import com.alibaba.fastjson.JSONObject;
import com.jinchang.wechat.entity.Company;
import com.jinchang.wechat.entity.HttpError;
import com.jinchang.wechat.entity.User;
import com.jinchang.wechat.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    protected CompanyRepository companyRepository;

    @GetMapping("/count")
    public ResponseEntity<?> getCount(@RequestParam(required=false) String status){
        int r = companyRepository.countCompany(status);
        JSONObject result = new JSONObject();
        result.put("count", r);
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<?> getList(@RequestParam(required=false) int page, @RequestParam(required=false) String status){
        if(page > 0) { page -= 1;}
        Page<Company> r = companyRepository.findPageCompanies(status, PageRequest.of(page, 10, Sort.Direction.DESC, "created"));
        JSONObject result = new JSONObject();
        result.put("companyList", r.getContent());
        return new ResponseEntity<JSONObject>(result ,HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getList(){
        List<Company> companyList = companyRepository.findAll();
        return new ResponseEntity<List<Company>>(companyList ,HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody JSONObject request){
        if(request.get("name") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "没有公司名字"),HttpStatus.BAD_REQUEST);
        }
        String name = request.get("name").toString();
        Company existCompany = companyRepository.findByName(name);
        if(existCompany != null){
            return new ResponseEntity<HttpError>(new HttpError(400, "该公司已存在"),HttpStatus.BAD_REQUEST);
        }
        Company company = new Company();
        company.setName(name);
        if(request.get("image") != null){
            company.setImage(request.get("image").toString());
        }
        if(request.get("remark") != null){
            company.setRemark(request.get("remark").toString());
        }
        if(request.get("contactPeople") != null){
            company.setContactPeople(request.get("contactPeople").toString());
        }
        if(request.get("phone") != null){
            company.setPhone(request.get("phone").toString());
        }
        if(request.get("email") != null){
            company.setEmail(request.get("email").toString());
        }
        if(request.get("status") != null){
            company.setStatus(request.get("status").toString());
        }
        company.setCreated(new Date());
        companyRepository.save(company);
        return new ResponseEntity<Company>(company, HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody JSONObject request){
        if(request.get("id") == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "该公司不存在"),HttpStatus.BAD_REQUEST);
        }
        Company company = companyRepository.findById(Long.parseLong(request.get("id").toString()));
        if(company == null){
            return new ResponseEntity<HttpError>(new HttpError(400, "该公司不存在"),HttpStatus.BAD_REQUEST);
        }
        if(request.get("name") != null){
            company.setName(request.get("name").toString());
        }
        if(request.get("image") != null){
            company.setImage(request.get("image").toString());
        }
        if(request.get("remark") != null){
            company.setRemark(request.get("remark").toString());
        }
        if(request.get("contactPeople") != null){
            company.setContactPeople(request.get("contactPeople").toString());
        }
        if(request.get("phone") != null){
            company.setPhone(request.get("phone").toString());
        }
        if(request.get("email") != null){
            company.setEmail(request.get("email").toString());
        }
        if(request.get("status") != null){
            company.setStatus(request.get("status").toString());
        }
        companyRepository.save(company);
        return new ResponseEntity<Company>(company, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable String id) {
        companyRepository.deleteById(Long.parseLong(id));
        JSONObject json = new JSONObject();
        json.put("result", "ok");
        return new ResponseEntity<JSONObject>(json ,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable String id){
        Company company = companyRepository.findById(Long.parseLong(id));
        return new ResponseEntity<Company>(company ,HttpStatus.OK);
    }

}

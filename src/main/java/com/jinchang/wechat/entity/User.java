package com.jinchang.wechat.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "sys_user")
public class User {

    @Id
    @GeneratedValue
    private long id;
    private String username;
    private String password;
    private String email;
    private String employeeId; //工号
    private String openId;
    private String nickName;
    private String imageUrl;
    private String udeskId;   //udesk的客户号
    private String agentId;
    private String phone;
    private Boolean autoEmail;
    private float score;
    private String status;  //客户状态living，left
    private String clientRoles;
    private String managerRoles;
    private Date created;
    private String org;
    private String orgTree;
    private String orgCode;
    private long companyId;
    private String position;

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() { return email; }

    public String getEmployeeId() { return employeeId; }

    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhone() { return phone; }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getUdeskId() { return udeskId; }

    public void setUdeskId(String udeskId) { this.udeskId = udeskId; }

    public Boolean getAutoEmail() { return autoEmail; }

    public void setAutoEmail(Boolean autoEmail) { this.autoEmail = autoEmail; }

    public float getScore() { return score; }

    public void setScore(float score) { this.score = score; }

    public String getAgentId() { return agentId; }

    public void setAgentId(String agentId) { this.agentId = agentId; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public String getClientRoles() { return clientRoles; }

    public void setClientRoles(String clientRoles) { this.clientRoles = clientRoles; }

    public String getManagerRoles() { return managerRoles; }

    public void setManagerRoles(String managerRoles) { this.managerRoles = managerRoles; }

    public Date getCreated() { return created; }

    public void setCreated(Date created) { this.created = created; }

    public String getOrg() { return org; }

    public void setOrg(String org) { this.org = org; }

    public String getOrgTree() { return orgTree; }

    public void setOrgTree(String orgTree) { this.orgTree = orgTree; }

    public String getOrgCode() { return orgCode; }

    public void setOrgCode(String orgCode) { this.orgCode = orgCode; }

    public long getCompanyId() { return companyId; }

    public void setCompanyId(long companyId) { this.companyId = companyId; }

    public String getPosition() { return position; }

    public void setPosition(String position) { this.position = position; }
}

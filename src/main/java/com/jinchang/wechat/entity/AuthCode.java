package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_auth_code")
public class AuthCode {

    @Id
    @GeneratedValue
    private long id;
    private String phone;
    private String code;
    private Date expire;

    public long getId() {
        return id;
    }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public String getCode() { return code; }

    public void setCode(String code) { this.code = code; }

    public Date getExpire() { return expire; }

    public void setExpire(Date expire) { this.expire = expire; }
}

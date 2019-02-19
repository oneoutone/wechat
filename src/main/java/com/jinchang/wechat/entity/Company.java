package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_company")
public class Company {
    @Id
    @GeneratedValue
    private long id;
    private String name;
    private String status;
    private String contactPeople;
    private String phone;
    private String email;
    private String image;
    private String remark;
    private Date created;

    public long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getContactPeople() { return contactPeople; }
    public void setContactPeople(String contactPeople) { this.contactPeople = contactPeople; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    public Date getCreated() { return created; }
    public void setCreated(Date created) { this.created = created; }

}

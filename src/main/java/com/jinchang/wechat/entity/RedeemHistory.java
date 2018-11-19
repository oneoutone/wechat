package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_redeem_history")
public class RedeemHistory {

    @Id
    @GeneratedValue
    private long id;
    private long userId;
    private long productId;
    private Date created;
    private String status;
    private String userName;
    private String userPhone;
    private String employeeId;
    private String userOrg;
    private String productName;
    private float price;
    private String no;
    private String imageUrl;

    public long getId() { return id; }

    public long getUserId() { return userId; }

    public void setUserId(long userId) { this.userId = userId; }

    public long getProductId() { return productId; }

    public void setProductId(long productId) { this.productId = productId; }

    public Date getCreated() { return created; }

    public void setCreated(Date created) { this.created = created; }

    public String getStatus() { return this.status; }

    public void setStatus(String status) { this.status = status; }

    public String getUserName() { return this.userName; }

    public void setUserName(String userName) { this.userName = userName; }

    public String getUserPhone() { return this.userPhone; }

    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public String getUserOrg() { return this.userOrg; }

    public void setUserOrg(String userOrg) { this.userOrg = userOrg; }

    public String getProductName() { return this.productName; }

    public void setProductName(String productName) { this.productName = productName; }

    public float getPrice() { return price; }

    public void setPrice(float price) { this.price = price; }

    public void setNo(String no) { this.no = no; }

    public String getNo() { return this.no; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getimageUrl() { return this.imageUrl; }

    public String getEmployeeId() { return this.employeeId; }

    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
}

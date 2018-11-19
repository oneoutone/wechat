package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "sys_product")
public class Product {
    @Id
    @GeneratedValue
    private long id;
    private String abbreviation;
    private String name;
    private String no;
    private String status;  //草稿:draft; 待审核:confirm_waiting; 已审核:confirmed; 审核驳回: confirm_refused
    private String saleStatus;//上架:up 下架:down
    private float score;
    private int store;
    private Date start;
    private Date end;
    private String remark;
    private Date created;
    private Date last_modify;
    private String simpleImageUrl;
    private String detailImageUrl;
    private float price;
    private boolean deleted;

    public long getId() {
        return id;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getName() { return name; }

    public void setName(String name) {
        this.name = name;
    }

    public String getNo() { return no; }

    public void setNo(String no) {
        this.no = no;
    }

    public String getStatus() { return status; }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSaleStatus() { return saleStatus; }

    public void setSaleStatus(String saleStatus) {
        this.saleStatus = saleStatus;
    }

    public float getScore() { return score; }

    public void setScore(float score) {
        this.score = score;
    }

    public int getStore() { return store; }

    public void setStore(int store) {
        this.store = store;
    }

    public Date getStart() { return start; }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() { return end; }

    public void setEnd(Date end) {
        this.end = end;
    }

    public String getRemark() { return remark; }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Date getCreated() { return created; }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getLast_modify() { return last_modify; }

    public void setLast_modify(Date last_modify) {
        this.last_modify = last_modify;
    }

    public String getSimpleImageUrl() { return simpleImageUrl; }

    public void setSimpleImageUrl(String simpleImageUrl) {
        this.simpleImageUrl = simpleImageUrl;
    }

    public String getDetailImageUrl() { return detailImageUrl; }

    public void setDetailImageUrl(String detailImageUrl) {
        this.detailImageUrl = detailImageUrl;
    }

    public float getPrice() { return price; }

    public void setPrice(float price) { this.price = price; }

    public boolean getDeleted() { return deleted; }

    public void setDeleted(boolean deleted) { this.deleted = deleted; }

}

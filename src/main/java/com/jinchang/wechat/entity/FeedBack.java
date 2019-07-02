package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_feedback")
public class FeedBack {
    @Id
    @GeneratedValue
    private long id;
    private String title;
    private String content;
    private String category;
    private long userId;
    private String userName;
    private String userImage;
    private boolean open;
    private boolean hide;
    private Date created;
    private int support;
    private boolean agree;

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getCategory() {
        return category;
    }

    public long getUserId() {
        return userId;
    }

    public boolean isOpen() {
        return open;
    }

    public boolean isHide() {
        return hide;
    }

    public Date getCreated() {
        return created;
    }

    public int getSupport() {
        return support;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public void setHide(boolean hide) {
        this.hide = hide;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public void setSupport(int support) {
        this.support = support;
    }

    public boolean isAgree() {
        return agree;
    }

    public void setAgree(boolean agree) {
        this.agree = agree;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserImage() {
        return userImage;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserImage(String userImage) {
        this.userImage = userImage;
    }
}

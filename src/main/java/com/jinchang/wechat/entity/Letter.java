package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_letter")
public class Letter {
    @Id
    @GeneratedValue
    private long id;
    private String title;
    private String content;
    private long userId;
    private Date created;
    private String reply;
    private String result;

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public long getUserId() {
        return userId;
    }

    public Date getCreated() {
        return created;
    }

    public String getResult() {
        return result;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}

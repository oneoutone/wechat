package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_support")
public class Support {
    @Id
    @GeneratedValue
    private long id;
    private long userId;
    private long feedbackId;
    private Date created;

    public long getId() {
        return id;
    }

    public long getUserId() {
        return userId;
    }

    public long getFeedbackId() {
        return feedbackId;
    }

    public Date getCreated() {
        return created;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setFeedbackId(long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public void setCreated(Date created) {
        this.created = created;
    }
}

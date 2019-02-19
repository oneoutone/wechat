package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_register_history")
public class RegisterHistory {
    @Id
    @GeneratedValue
    private long id;
    private long userId;
    private Date created;

    public long getId() {
        return id;
    }

    public long getUserId() { return userId; }

    public void setUserId(long userId) { this.userId = userId; }

    public Date getCreated() { return created; }

    public void setCreated(Date created) { this.created = created; }
}

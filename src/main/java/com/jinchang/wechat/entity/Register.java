package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_register")
public class Register {
    @Id
    @GeneratedValue
    private long id;
    private long userId;
    private Date created;
    private Date lastRegister;
    private int continuousRegister;
    private boolean reward7;
    private boolean reward14;
    private boolean reward21;

    public long getId() {
        return id;
    }

    public long getUserId() { return userId; }

    public void setUserId(long userId) { this.userId = userId; }

    public Date getCreated() { return created; }

    public void setCreated(Date created) { this.created = created; }

    public Date getLastRegister() { return lastRegister; }

    public void setLastRegister(Date lastRegister) { this.lastRegister = lastRegister; }

    public int getContinuousRegister() { return continuousRegister; }

    public void setContinuousRegister(int continuousRegister) { this.continuousRegister = continuousRegister; }

    public boolean getReward7() { return reward7; }

    public void setReward7(boolean reward7) { this.reward7 = reward7; }

    public boolean getReward14() { return reward14; }

    public void setReward14(boolean reward14) { this.reward14 = reward14; }

    public boolean getReward21() { return reward21; }

    public void setReward21(boolean reward21) { this.reward21 = reward21; }
}

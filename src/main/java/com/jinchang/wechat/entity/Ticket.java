package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sys_ticket")
public class Ticket {
    @Id
    @GeneratedValue
    private long id;
    private int score;
    private String udeskId;
    private long userId;

    public long getId() {
        return id;
    }

    public long getScore() {
        return score;
    }

    public void setScore(int score) { this.score = score; }

    public String getUdeskId() { return udeskId; }

    public void setUdeskId(String udeskId) { this.udeskId = udeskId; }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) { this.userId = userId; }
}

package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sys_meeting_room")
public class MeetingRoom {
    @Id
    @GeneratedValue
    private long id;
    private String externalId;
    private String name;
    private int seatNum;

    public long getId() {
        return id;
    }

    public String getExternalId() { return externalId; }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getName() { return name; }

    public void setName(String name) {
        this.name = name;
    }

    public int getSeatNum() { return seatNum; }

    public void setSeatNum(int seatNum) { this.seatNum = seatNum; }
}

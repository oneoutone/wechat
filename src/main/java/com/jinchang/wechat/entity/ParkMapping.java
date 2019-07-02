package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sys_park_mapping")
public class ParkMapping {
    @Id
    @GeneratedValue
    private long id;
    private long parkId;
    private long userId;

    public long getId() {
        return id;
    }

    public long getParkId() {
        return parkId;
    }

    public long getUserId() {
        return userId;
    }

    public void setParkId(long parkId) {
        this.parkId = parkId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}

package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_activity")
public class Activity {
    @Id
    @GeneratedValue
    private long id;
    private String description;
    private Date start;
    private Date end;
    private Date created;
    private Date last_modify;
    private String image_url;

    public long getId() {
        return id;
    }






}

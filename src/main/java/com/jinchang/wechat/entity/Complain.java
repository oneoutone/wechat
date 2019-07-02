package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_complain")
public class Complain {
    @Id
    @GeneratedValue
    private long id;
    private String title;
    private String content;
    private String category;
    private long userId;
    private Date created;
    private String released;
    private Date releaseDate;
    private String resultTitle;
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

    public String getCategory() {
        return category;
    }

    public long getUserId() {
        return userId;
    }

    public Date getCreated() {
        return created;
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

    public void setCreated(Date created) {
        this.created = created;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getResultTitle() {
        return resultTitle;
    }

    public void setResultTitle(String resultTitle) {
        this.resultTitle = resultTitle;
    }

    public String getReleased() {
        return released;
    }

    public void setReleased(String released) {
        this.released = released;
    }
}

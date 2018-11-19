package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_score_history")
public class ScoreHistory {
    @Id
    @GeneratedValue
    private long id;
    private long userId;
    private String type; //add, reduce
    private float score;
    private String remark;
    private Date created;

    public long getId() { return id; }

    public long getUserId() { return userId; }

    public void setUserId(long userId) { this.userId = userId; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public String getRemark() { return remark; }

    public void setRemark(String remark) { this.remark = remark; }

    public float getScore() { return score; }

    public void setScore(float score) { this.score = score; }

    public Date getCreated() { return created; }

    public void setCreated(Date created) { this.created = created; }

}

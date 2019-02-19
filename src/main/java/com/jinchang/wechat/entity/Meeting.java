package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "sys_meeting")
public class Meeting {

    @Id
    @GeneratedValue
    private long id;
    private Date start;
    private Date end;
    private String topic;
    private String remark;
    private Date created;
    private long userId;
    private String userName;
    private long companyId;
    private String companyName;
    private long meetingRoomId;
    private String meetingRoomName;
    private String channel; // wechat, manager

    public long getId() { return id; }

    public Date getStart() { return start; }
    public void setStart(Date start) { this.start = start; }

    public Date getEnd() { return end; }
    public void setEnd(Date end) { this.end = end; }

    public String getRemark() { return remark; }
    public void setRemark( String remark) { this.remark = remark; }

    public String getTopic() { return topic; }
    public void setTopic( String topic) { this.topic = topic; }

    public Date getCreated() { return created; }
    public void setCreated(Date created) { this.created = created; }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName( String userName) { this.userName = userName; }

    public long getCompanyId() { return companyId; }
    public void setCompanyId(long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName( String companyName) { this.companyName = companyName; }

    public long getMeetingRoomId() { return meetingRoomId; }
    public void setMeetingRoomId(long meetingRoomId) { this.meetingRoomId = meetingRoomId; }

    public String getMeetingRoomName() { return meetingRoomName; }
    public void setMeetingRoomName( String meetingRoomName) { this.meetingRoomName = meetingRoomName; }

    public String getChannel() { return channel; }
    public void setChannel( String channel) { this.channel = channel; }
}

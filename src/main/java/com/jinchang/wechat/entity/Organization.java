package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sys_organization")
public class Organization {

    @Id
    @GeneratedValue
    private long id;

    private String name;
    private String code;
    private String parent;
    private int level;
    private boolean showAsChoice;
    private String orgCode;
    private String orgTree;

    public long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) {
        this.name = name;
    }
    public String getCode() { return code; }
    public void setCode(String code) {
        this.code = code;
    }
    public String getParent() { return parent; }
    public void setParent(String parent) {
        this.parent = parent;
    }
    public int getLevel() { return level; }
    public void setLevel(int level) {
        this.level = level;
    }
    public boolean getShowAsChoice() { return showAsChoice; }
    public void setShowAsChoice(boolean showAsChoice) {
        this.showAsChoice = showAsChoice;
    }
    public String getOrgCode() { return orgCode; }
    public void setOrgCode(String orgCode) {
        this.orgCode = orgCode;
    }
    public String getOrgTree() { return orgTree; }
    public void setOrgTree(String orgTree) {
        this.orgTree = orgTree;
    }
}

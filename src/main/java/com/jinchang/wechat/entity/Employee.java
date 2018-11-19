package com.jinchang.wechat.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sys_employee")
public class Employee {
    @Id
    @GeneratedValue
    private long id;
    private String employeeId;
    private String orgName;
    private String orgCode;
    private String orgTree;

    public long getId() { return id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getOrgName() { return orgName; }
    public void setOrgName(String orgName) { this.orgName = orgName; }

    public String getOrgCode() { return orgCode; }
    public void setOrgCode(String orgCode) { this.orgCode = orgCode; }

    public String getOrgTree() { return orgTree; }
    public void setOrgTree(String orgTree) { this.orgTree = orgTree; }
}

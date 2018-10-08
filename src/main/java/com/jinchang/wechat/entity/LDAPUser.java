package com.jinchang.wechat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;
import org.springframework.ldap.support.LdapNameBuilder;
import javax.naming.Name;


@Entry(objectClasses = {"custUserExt","inetOrgPerson","orclUser","orclUserV2","organizationalPerson","person","top"},base = "dc=com,dc=cj-jt,cn=Users")
public class LDAPUser {
    @Id
    @JsonIgnore
    private Name dn;

    @Attribute(name="cn")
    private String cn;

    @Attribute(name="sn")
    private String sn;

    @Attribute(name="employeetype")
    private String employeetype;

    @Attribute(name="jcbirthday")
    private String jcbirthday;

    @Attribute(name="jcemployeecode")
    private String jcemployeecode;

    @Attribute(name="jcemployeestartdate")
    private String jcemployeestartdate;

    @Attribute(name="jcemployeestatus")
    private String jcemployeestatus;

    @Attribute(name="jcfullname")
    private String jcfullname;

    @Attribute(name="jcgender")
    private String jcgender;

    @Attribute(name="jcidcardnumber")
    private String jcidcardnumber;

    @Attribute(name="jclastupdate")
    private String jclastupdate;

    @Attribute(name="mail")
    private String mail;

    @Attribute(name="mobile")
    private String mobile;

    @Attribute(name="telephonenumber")
    private String telephonenumber;

    public String getCn() {
        return this.cn;
    }

    public String getEmployeetype() {
        return this.employeetype;
    }

    public String getJcemployeecode() {
        return this.jcemployeecode;
    }

    public String getJcemployeestatus() {
        return this.jcemployeestatus;
    }

    public String getJcgender() {
        return this.jcgender;
    }

    public String getMail() {
        return this.mail;
    }

    public String getMobile() {
        return this.mobile;
    }

    public String getTelephonenumber() {
        return this.telephonenumber;
    }
}

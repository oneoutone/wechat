package com.jinchang.wechat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;

import javax.naming.Name;
import java.util.List;

@Entry(objectClasses = {"custOUExt","groupOfUniqueNames","orclDynamicGroup","organizationalUnit","top"},base = "dc=com,dc=cj-jt,cn=Groups,cn=structGroups, cn=organizations")

public class LDAPOrganization {
    @Id
    @JsonIgnore
    private Name dn;

    @Attribute(name="cn")
    private String cn;

    @Attribute(name="ou")
    private String ou;

    @Attribute(name="jcchnname")
    private String jcchnname;

    @Attribute(name="jcorgcode")
    private String jcorgcode;

    @Attribute(name="jcparentdeptcode")
    private String jcparentdeptcode;

    @Attribute(name="uniquemember")
    private List<String> uniquemember;

    public String getCn() {
        return this.cn;
    }
    public String getOu() {
        return this.ou;
    }
    public String getJcchnname() {
        return this.jcchnname;
    }
    public String getJcorgcode() {
        return this.jcorgcode;
    }
    public String getJcparentdeptcode() {
        return this.jcparentdeptcode;
    }
    public List<String> getUniquemember() {
        return this.uniquemember;
    }
}


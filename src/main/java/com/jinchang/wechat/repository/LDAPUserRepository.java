package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.LDAPOrganization;
import com.jinchang.wechat.entity.LDAPUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Service
public class LDAPUserRepository {

    @Autowired
    private LdapTemplate ldapTemplate;

    public LDAPUser findByCn(String cn){
        return ldapTemplate.findOne(query().where("cn").is(cn),LDAPUser.class);
    }

    public List<LDAPUser> findByCnAndPhone(String phone, String cn){
        return ldapTemplate.find(query().where("mobile").is(phone).and("cn").is(cn), LDAPUser.class);
    }

    public List<LDAPUser> findByCns(String cn){
        return ldapTemplate.find(query().where("cn").is(cn), LDAPUser.class);
    }

    public List<LDAPOrganization> findOrgnaizations() {
        return ldapTemplate.findAll(LDAPOrganization.class);
    }

    public List<LDAPUser> findByName(String name) { return ldapTemplate.find(query().where("jcfullname").is(name), LDAPUser.class);}

}

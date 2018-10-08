package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.LDAPUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Service;
import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Service
public class LDAPUserRepository {

    @Autowired
    private LdapTemplate ldapTemplate;

    public LDAPUser findByCn(String cn){
        return ldapTemplate.findOne(query().where("cn").is(cn),LDAPUser.class);
    }

}

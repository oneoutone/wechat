package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.AuthCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;

public interface AuthCodeRepository extends JpaRepository<AuthCode, Long> {

    AuthCode findByPhoneAndCodeAndExpireAfter(String phone, String code, Date expire);

}

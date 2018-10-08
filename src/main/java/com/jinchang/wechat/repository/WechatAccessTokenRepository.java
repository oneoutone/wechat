package com.jinchang.wechat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jinchang.wechat.entity.WechatAccessToken;
import java.util.Date;

public interface WechatAccessTokenRepository extends JpaRepository<WechatAccessToken, Long> {

    WechatAccessToken findFirstByExpireAfter(Date expire);

}

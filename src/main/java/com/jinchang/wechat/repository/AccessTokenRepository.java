package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.AccessToken;
import org.aspectj.apache.bcel.util.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import javax.persistence.Access;

public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {

    AccessToken findByAccessTokenEqualsAndExpireAfter(String accessToken, Date expire);

}

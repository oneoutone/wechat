package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.JsapiTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;

public interface JsapiTicketRepository extends JpaRepository<JsapiTicket, Long> {

    JsapiTicket findFirstByExpireAfter(Date expire);
}

package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Ticket findByUdeskId(String udeskId);
}

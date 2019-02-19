package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Register;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegisterRepository extends JpaRepository<Register, Long> {
    Register findByUserId(long userId);
}

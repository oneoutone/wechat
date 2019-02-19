package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.RegisterHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface RegisterHistoryRepository extends JpaRepository<RegisterHistory, Long> {

    List<RegisterHistory> findAllByUserIdAndCreatedBetween(long userId, Date start, Date end);
}

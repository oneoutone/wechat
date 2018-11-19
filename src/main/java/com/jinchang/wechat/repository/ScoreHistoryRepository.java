package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.ScoreHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreHistoryRepository extends JpaRepository<ScoreHistory, Long> {

    List<ScoreHistory> findAllByUserIdOrderByCreatedDesc(long userId);
}

package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Support;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportRepository extends JpaRepository<Support, Long> {
    Support findById(long id);

    Support findByUserIdAndFeedbackId(long userId, long feedbackId);

    void deleteByUserIdAndFeedbackId(long userId, long feedbackId);

}

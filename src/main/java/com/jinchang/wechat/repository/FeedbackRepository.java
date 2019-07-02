package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.FeedBack;
import com.jinchang.wechat.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<FeedBack, Long> {

    List<FeedBack> findAllByUserIdOrOpen(long userId, boolean open, Pageable pageable);

    int countByUserIdOrOpen(long userId, boolean open);

    List<FeedBack> findAllByUserId(long userId, Pageable pageable);

    int countByUserId(long userId);

    FeedBack findById(long id);

    @Query(value = "select * from sys_feedback where if(?1 !='',title like %?1%,1=1) and if(?2 !='',category=?2,1=1)" ,nativeQuery = true)
    Page<FeedBack> findPageFeedback(String filter, String category, Pageable pageable);

    @Query(value = "select count(*) from sys_feedback where if(?1 !='',title like %?1%,1=1) and if(?2 !='',category=?2,1=1)",nativeQuery = true)
    int countFeedback(String filter, String category);


}

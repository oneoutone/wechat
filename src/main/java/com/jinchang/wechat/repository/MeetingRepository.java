package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findAllByStartBetween(Date start, Date end);

    Meeting findById(long id);
}

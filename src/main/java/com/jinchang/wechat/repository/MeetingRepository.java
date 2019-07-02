package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findAllByStartBetween(Date start, Date end);

    List<Meeting> findAllByMeetingRoomIdInAndStartBetween(List roomIds, Date start, Date end);

    List<Meeting> findAllByMeetingRoomIdAndStartBetweenOrderByStartAsc(long id, Date start, Date end);

    List<Meeting> findAllByMeetingRoomIdAndEndBetweenOrderByStartAsc(long id, Date start, Date end);

    List<Meeting> findAllByStartBeforeAndEndAfterAndMeetingRoomId(Date d1, Date d2, long id);

    List<Meeting> findAllByMeetingRoomIdAndStartBetweenAndConfirmedOrderByStartAsc(long id, Date start, Date end, Boolean confirmed);

    Meeting findById(long id);
}

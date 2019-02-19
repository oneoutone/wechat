package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {

}

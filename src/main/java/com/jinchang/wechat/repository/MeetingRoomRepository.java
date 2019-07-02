package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {

    List<MeetingRoom> findAllByBuildingId(long buildingId);

}

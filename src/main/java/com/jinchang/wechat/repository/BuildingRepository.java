package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Building;
import com.jinchang.wechat.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    Building findById(long id);

    List<Building> findAll();

    Building findByName(String name);
}

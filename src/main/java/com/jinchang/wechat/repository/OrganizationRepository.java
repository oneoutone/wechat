package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    List<Organization> findAllByLevelIn(List<Integer> levels);

}

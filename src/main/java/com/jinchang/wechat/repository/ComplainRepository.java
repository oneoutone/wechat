package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Complain;
import com.jinchang.wechat.entity.FeedBack;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComplainRepository  extends JpaRepository<Complain, Long> {

    List<Complain> findAllByUserId(long userId, Pageable pageable);

    int countByUserId(long userId);

    Complain findById(long id);

    @Query(value = "select * from sys_complain where if(?1 !='',title like %?1%,1=1) and if(?2 !='',category=?2,1=1) and if(?3 !='',released=?3, 1=1)" ,nativeQuery = true)
    Page<Complain> findPageComplain(String filter, String category, String released, Pageable pageable);

    @Query(value = "select count(*) from sys_complain where if(?1 !='',title like %?1%,1=1) and if(?2 !='',category=?2,1=1) and if(?3 !='',released=?3, 1=1)",nativeQuery = true)
    int countComplain(String filter, String category, String released);

}

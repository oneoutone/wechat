package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Complain;
import com.jinchang.wechat.entity.Letter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LetterRepository  extends JpaRepository<Letter, Long> {

    List<Letter> findAllByUserId(long userId, Pageable pageable);

    int countByUserId(long userId);

    Letter findById(long id);

    @Query(value = "select * from sys_letter where if(?1 !='',title like %?1%,1=1) and if(?2 !='',reply=?2, 1=1)" ,nativeQuery = true)
    Page<Letter> findPageLetter(String filter, String released, Pageable pageable);

    @Query(value = "select count(*) from sys_letter where if(?1 !='',title like %?1%,1=1) and if(?2 !='',reply=?2, 1=1)",nativeQuery = true)
    int countLetter(String filter, String released);

}

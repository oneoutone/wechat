package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.RedeemHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface RedeemHistoryRepository extends JpaRepository<RedeemHistory, Long>  {

    List<RedeemHistory> findAllByUserIdOrderByCreatedDesc(long userId);

    @Query(value = "select * from sys_redeem_history where if(?1 !='',user_org like ?1,1=1) and if(?2 !='',employee_id=?2,1=1)" +
            "and if(?3 !='',product_name like ?3,1=1) and if(?4 !='',created >= ?4 ,1=1) and  if(?5 !='',created <= ?5 ,1=1)",nativeQuery = true)
    Page<RedeemHistory> findPageRedeems(String org, String employeeId, String productName, Date d1, Date d2, Pageable pageable);

    @Query(value = "select * from sys_redeem_history where if(?1 !='',user_org like ?1,?1=1) and if(?2 !='',employee_id=?2,1=1)" +
            "and if(?3 !='',product_name like ?3,1=1) and if(?4 !='',created >= ?4 ,1=1) and  if(?5 !='',created <= ?5 ,1=1)",nativeQuery = true)
    List<RedeemHistory> findAllRedeemsList(String org, String employeeId, String productName, Date d1, Date d2);

    @Query(value = "select count(*) from sys_redeem_history where if(?1 !='',user_org like ?1,1=1) and if(?2 !='',employee_id=?2,1=1)" +
            "and if(?3 !='',product_name like ?3,1=1) and if(?4 !='',created >= ?4 ,1=1) and  if(?5 !='',created <= ?5 ,1=1)",nativeQuery = true)
    int countRedeems(String org, String employeeId, String productName, Date d1, Date d2);

    RedeemHistory findById(long id);
}

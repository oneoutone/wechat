package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.Date;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "select * from sys_product where if(?1 !='',name like %?1%,1=1) and if(?2 !='',status=?2,1=1)" +
            "and if(?3 !='',sale_status=?3,1=1) and if(?4 !='',created >= ?4 ,1=1) and  if(?5 !='',created <= ?5 ,1=1) and  if(?6 !=0,id = ?6 ,1=1) and deleted=false",nativeQuery = true)
    Page<Product> findPageProducts(String name,String status,String saleStatus, Date d1, Date d2, long id, Pageable pageable);

    @Query(value = "select count(*) from sys_product where if(?1 !='',name like %?1%,1=1) and if(?2 !='',status=?2,1=1)" +
            "and if(?3 !='',sale_status=?3,1=1) and if(?4 !='',created >= ?4 ,1=1) and  if(?5 !='',created <= ?5 ,1=1) and  if(?6 !=0,id = ?6 ,1=1) and deleted=false",nativeQuery = true)
    int countProducts(String name,String status,String saleStatus, Date d1, Date d2, long id);

    Product findById(long id);

    List<Product> findAllByIdIn(Collection<Long> ids);

    List<Product> findAllByStatusAndStartBeforeAndEndAfterAndSaleStatusAndDeletedOrderByCreatedDesc(String status, Date d1, Date d2, String saleStatus, boolean deleted);
}

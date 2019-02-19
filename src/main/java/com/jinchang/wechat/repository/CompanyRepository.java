package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Company;
import com.jinchang.wechat.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Company findByName(String name);

    Company findById(long id);

    @Query(value = "select count(*) from sys_company  where if(?1 !='',status = ?1,1=1)", nativeQuery = true)
    int countCompany(String status);

    @Query(value = "select * from sys_company where if(?1 !='',status = ?1,1=1)",nativeQuery = true)
    Page<Company> findPageCompanies(String saleStatus, Pageable pageable);



}

package com.jinchang.wechat.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jinchang.wechat.entity.User;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>  {
    User findByUsername(String username);

    User findByOpenId(String openId);

    User findById(long id);

    User findByUdeskId(String udeskId);

    User findByEmail(String email);

    User findByAgentId(String agentId);

    User findByUsernameAndPassword(String username, String password);

    User findByEmployeeId(String employeeId);

    List<User> findAllByManagerRolesIsNotNull();

    @Query(value = "select * from sys_user where if(?1 !='',company_id = ?1,1=1)", nativeQuery = true)
    Page<User> findAllByCompanyId(long companyId, Pageable pageable);

    @Query(value = "select count(*) from sys_user where if(?1 !='',company_id = ?1,1=1)", nativeQuery = true)
    int countCompanyUser(long companyId);
}

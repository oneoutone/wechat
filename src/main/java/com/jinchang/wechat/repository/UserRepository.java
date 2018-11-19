package com.jinchang.wechat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jinchang.wechat.entity.User;
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


}

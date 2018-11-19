package com.jinchang.wechat.repository;

import com.jinchang.wechat.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Employee findAllByEmployeeId(String employeeId);
}

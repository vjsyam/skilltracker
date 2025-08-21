package com.examly.springapp.repository;

import com.examly.springapp.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e " +
       "LEFT JOIN FETCH e.user " +
       "LEFT JOIN FETCH e.manager " +
       "LEFT JOIN FETCH e.department " +
       "LEFT JOIN FETCH e.skills " +
       "WHERE e.id = :id")
Optional<Employee> findByIdWithRelations(@Param("id") Long id);

@Query("SELECT DISTINCT e FROM Employee e " +
       "LEFT JOIN FETCH e.user " +
       "LEFT JOIN FETCH e.manager " +
       "LEFT JOIN FETCH e.department " +
       "LEFT JOIN FETCH e.skills")
List<Employee> findAllWithRelations();

@Query(value = "SELECT DISTINCT e FROM Employee e " +
       "LEFT JOIN FETCH e.user " +
       "LEFT JOIN FETCH e.manager " +
       "LEFT JOIN FETCH e.department " +
       "LEFT JOIN FETCH e.skills",
       countQuery = "SELECT COUNT(DISTINCT e) FROM Employee e")
Page<Employee> findAllWithRelationsPaginated(Pageable pageable);

}

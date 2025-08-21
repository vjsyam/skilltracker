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

@Query(value = "SELECT DISTINCT e.id FROM Employee e " +
       "LEFT JOIN e.user u " +
       "LEFT JOIN e.department d " +
       "LEFT JOIN e.skills s " +
       "WHERE (:q IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%'))) " +
       "AND (:departmentId IS NULL OR d.id = :departmentId) " +
       "AND (:skillId IS NULL OR s.id = :skillId)")
Page<Long> searchIds(@Param("q") String q,
                     @Param("departmentId") Long departmentId,
                     @Param("skillId") Long skillId,
                     Pageable pageable);

@Query("SELECT DISTINCT e FROM Employee e " +
       "LEFT JOIN FETCH e.user " +
       "LEFT JOIN FETCH e.manager " +
       "LEFT JOIN FETCH e.department " +
       "LEFT JOIN FETCH e.skills " +
       "WHERE e.id IN :ids")
List<Employee> findAllByIdInWithRelations(@Param("ids") List<Long> ids);

}

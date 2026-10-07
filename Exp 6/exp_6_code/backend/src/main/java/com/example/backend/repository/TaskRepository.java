package com.example.backend.repository;

import com.example.backend.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // 1. Pagination & Sorting is supported by default via findAll(Pageable pageable)

    // 2. N+1 Problem & JOIN FETCH
    // This query fetches tasks and their associated comments in a single round-trip to the DB
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.comments")
    List<Task> findAllWithComments();

    // 3. Native SQL Query
    // Complex or database-specific query example
    @Query(value = "SELECT * FROM tasks ORDER BY id DESC LIMIT 5", nativeQuery = true)
    List<Task> findTop5TasksNative();
}

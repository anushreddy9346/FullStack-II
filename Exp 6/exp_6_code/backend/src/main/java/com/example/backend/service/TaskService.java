package com.example.backend.service;

import com.example.backend.entity.Task;
import com.example.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Pagination and Sorting example
    public Page<Task> getTasksPaginated(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    // Caching example: Cache the result of fetching all tasks with comments
    @Cacheable("tasks")
    public List<Task> getAllTasksWithComments() {
        // We add a simulated delay to prove caching works
        try {
            Thread.sleep(1500); // 1.5 second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return taskRepository.findAllWithComments();
    }

    // Native query example
    public List<Task> getTop5Tasks() {
        return taskRepository.findTop5TasksNative();
    }

    // Evict cache when a new task is added
    @CacheEvict(value = "tasks", allEntries = true)
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    // Evict cache when a task is deleted
    @CacheEvict(value = "tasks", allEntries = true)
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // Evict cache when a task is updated
    @CacheEvict(value = "tasks", allEntries = true)
    public Task toggleTask(Long id) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setCompleted(!task.isCompleted());
            return taskRepository.save(task);
        }
        return null;
    }
}

package com.example.backend;

import com.example.backend.entity.Task;
import com.example.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SpringBootApplication
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Allows our React frontend to communicate with this backend
@EnableCaching // Enables Spring Caching
public class StudentTaskManagerApplication {

    private final TaskService taskService;

    @Autowired
    public StudentTaskManagerApplication(TaskService taskService) {
        this.taskService = taskService;
    }

    public static void main(String[] args) {
        SpringApplication.run(StudentTaskManagerApplication.class, args);
    }

    // ---------------------------------------------------------
    // Controller Endpoints
    // ---------------------------------------------------------

    // 1. Get all tasks (Paginated & Sorted)
    // Example: GET /api/tasks?page=0&size=5&sort=title,asc
    @GetMapping
    public Page<Task> getAllTasksPaginated(Pageable pageable) {
        return taskService.getTasksPaginated(pageable);
    }

    // 1b. Get all tasks with comments (demonstrates N+1 fix and Caching)
    @GetMapping("/with-comments")
    public List<Task> getAllTasksWithComments() {
        return taskService.getAllTasksWithComments();
    }

    // 1c. Get top 5 tasks (demonstrates Native Query)
    @GetMapping("/top")
    public List<Task> getTopTasks() {
        return taskService.getTop5Tasks();
    }

    // 2. Add a new task
    @PostMapping
    public Task addTask(@RequestBody Task newTask) {
        return taskService.addTask(newTask);
    }

    // 3. Delete a task
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "Task with ID " + id + " has been deleted!";
    }

    // 4. Toggle Task Completion
    @PutMapping("/{id}/toggle")
    public Task toggleTask(@PathVariable Long id) {
        return taskService.toggleTask(id);
    }
}

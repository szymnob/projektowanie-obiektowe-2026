package com.szymnob.lab3.controller

import com.szymnob.lab3.model.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class UserController {

    @GetMapping("/users")
    fun getUsers(): List<User> {
        return listOf(
            User(1, "John", "john@example.com", "USER"),
            User(2, "Maciek", "maciek@example.com", "ADMIN")
        )
    }
}

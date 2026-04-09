package com.szymnob.lab3.controller

import com.szymnob.lab3.model.LoginRequest
import com.szymnob.lab3.model.User
import com.szymnob.lab3.service.AuthService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class UserController(private val authService: AuthService) {

    @GetMapping("/users")
    fun getUsers(): List<User> {
        return listOf(
            User(1, "John", "john@example.com", "USER"),
            User(2, "Maciek", "maciek@example.com", "ADMIN")
        )
    }

    @PostMapping("/login")
    fun login(
        @RequestBody creds: LoginRequest
    ): String {
        val isValid = authService.check(creds.username, creds.password)

        return if (isValid) "Sukces: Zalogowano użytkownika ${creds.username}"
        else "Błąd: Nieprawidłowe dane logowania"
    }
}


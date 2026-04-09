package com.szymnob.lab3.service

import org.springframework.stereotype.Service

@Service
class AuthService {
    init{
        println("Eager")
    }
    fun check(u: String, p: String) = u == "admin" && p == "123"
}
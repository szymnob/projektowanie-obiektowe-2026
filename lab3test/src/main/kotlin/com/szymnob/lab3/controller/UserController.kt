import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping

@RestController
@RequestMapping("/api")
class UserController{

    @GetMapping("/users")
    fun getUsers(): List<User> {
        return listOf(
            User(1, "John", "john@example.com", "USER"),
            User(2, "Maciek", "maciek@example.com", "ADMIN"),
            User(3, "Anna", "anna@example.com", "USER")
        )
    }


}
import Fluent
import Vapor

func routes(_ app: Application) throws {
    app.get { req async throws in
        return req.redirect(to: "/products")
    }

    app.get("hello") { req async -> String in
        "Hello, world!"
    }

    try app.register(collection: ProductController())
}

import Fluent
import Vapor

struct ProductController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let products = routes.grouped("products")

        // Web UI routes
        products.get(use: self.indexView)
        products.get("create", use: self.createView)
        products.post(use: self.createPost)
        
        products.group(":productID") { product in
            product.get(use: self.showView)
            product.get("edit", use: self.editView)
            product.post(use: self.updatePost)
            product.post("delete", use: self.deletePost)
        }
        
        // API routes
        let api = routes.grouped("api", "products")
        api.get(use: self.index)
        api.post(use: self.create)
        api.group(":productID") { product in
            product.get(use: self.show)
            product.put(use: self.update)
            product.delete(use: self.delete)
        }
    }

    @Sendable
    func index(req: Request) async throws -> [ProductDTO] {
        try await Product.query(on: req.db).all().map { $0.toDTO() }
    }

    @Sendable
    func show(req: Request) async throws -> ProductDTO {
        guard let productID = req.parameters.get("productID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid product ID format.")
        }

        guard let product = try await Product.find(productID, on: req.db) else {
            throw Abort(.notFound)
        }

        return product.toDTO()
    }

    @Sendable
    func create(req: Request) async throws -> ProductDTO {
        let product = try req.content.decode(ProductDTO.self).toModel()

        try await product.save(on: req.db)
        return product.toDTO()
    }

    @Sendable
    func update(req: Request) async throws -> ProductDTO {
        guard let productID = req.parameters.get("productID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid product ID format.")
        }

        guard let product = try await Product.find(productID, on: req.db) else {
            throw Abort(.notFound)
        }

        let payload = try req.content.decode(ProductDTO.self)

        if let name = payload.name, !name.isEmpty {
            product.name = name
        }

        if let price = payload.price {
            product.price = price
        }

        try await product.save(on: req.db)
        return product.toDTO()
    }

    @Sendable
    func delete(req: Request) async throws -> HTTPStatus {
        guard let productID = req.parameters.get("productID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid product ID format.")
        }

        guard let product = try await Product.find(productID, on: req.db) else {
            throw Abort(.notFound)
        }

        try await product.delete(on: req.db)
        return .noContent
    }

    // MARK: - Web UI Methods
    
    @Sendable
    func indexView(req: Request) async throws -> View {
        let products = try await Product.query(on: req.db).all()
        return try await req.view.render("products/index", ["products": products])
    }

    @Sendable
    func createView(req: Request) async throws -> View {
        return try await req.view.render("products/create")
    }

    @Sendable
    func createPost(req: Request) async throws -> Response {
        let product = try req.content.decode(ProductDTO.self).toModel()
        try await product.save(on: req.db)
        return req.redirect(to: "/products/\(product.id!)")
    }

    @Sendable
    func showView(req: Request) async throws -> View {
        guard let productID = req.parameters.get("productID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid product ID format.")
        }

        guard let product = try await Product.find(productID, on: req.db) else {
            throw Abort(.notFound)
        }

        return try await req.view.render("products/show", ["product": product])
    }

    @Sendable
    func editView(req: Request) async throws -> View {
        guard let productID = req.parameters.get("productID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid product ID format.")
        }

        guard let product = try await Product.find(productID, on: req.db) else {
            throw Abort(.notFound)
        }

        return try await req.view.render("products/edit", ["product": product])
    }

    @Sendable
    func updatePost(req: Request) async throws -> Response {
        guard let productID = req.parameters.get("productID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid product ID format.")
        }

        guard let product = try await Product.find(productID, on: req.db) else {
            throw Abort(.notFound)
        }

        let payload = try req.content.decode(ProductDTO.self)

        if let name = payload.name, !name.isEmpty {
            product.name = name
        }

        if let price = payload.price {
            product.price = price
        }

        try await product.save(on: req.db)
        return req.redirect(to: "/products/\(product.id!)")
    }

    @Sendable
    func deletePost(req: Request) async throws -> Response {
        guard let productID = req.parameters.get("productID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid product ID format.")
        }

        guard let product = try await Product.find(productID, on: req.db) else {
            throw Abort(.notFound)
        }

        try await product.delete(on: req.db)
        return req.redirect(to: "/products")
    }
}
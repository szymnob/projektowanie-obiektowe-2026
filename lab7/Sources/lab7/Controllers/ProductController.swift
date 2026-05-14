import Fluent
import Vapor

struct ProductController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let products = routes.grouped("products")

        products.get(use: self.index)
        products.post(use: self.create)
        products.group(":productID") { product in
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
}
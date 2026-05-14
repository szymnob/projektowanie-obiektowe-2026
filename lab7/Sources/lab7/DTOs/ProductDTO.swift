import Fluent
import Vapor

struct ProductDTO: Content {
    var id: UUID?
    var name: String?
    var price: Double?

    func toModel() throws -> Product {
        guard let name, !name.isEmpty else {
            throw Abort(.badRequest, reason: "Field 'name' is required.")
        }

        guard let price else {
            throw Abort(.badRequest, reason: "Field 'price' is required.")
        }

        return Product(id: self.id, name: name, price: price)
    }
}
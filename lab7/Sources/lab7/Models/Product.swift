import Fluent
import Vapor

final class Product: Model, Content, @unchecked Sendable {
    static let schema = "products"
    
    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "price")
    var price: Double

    init() { }

    init(id: UUID? = nil, name: String, price: Double) {
        self.id = id
        self.name = name
        self.price = price
    }
}

extension Product {
    func toDTO() -> ProductDTO {
        ProductDTO(id: self.id, name: self.name, price: self.price)
    }
}
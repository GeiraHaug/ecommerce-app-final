const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

class ProductService {
    constructor(db) {
        this.Product = db.Product;
    }

    async getAllProducts() {
        const query = `
            SELECT 
                p.name,                 
                p.id, 
                p.description, 
                p.price,  
                p.Date_Added AS date_added, 
                p.imageUrl,
                p.quantity, 
                p.isDeleted,
                p.createdAt,
                p.BrandId, 
                p.CategoryId, 
                b.name AS brand, 
                c.name AS category
            FROM Products p
            LEFT JOIN Brands b ON p.BrandId = b.Id
            LEFT JOIN Categories c ON p.CategoryId = c.Id
        `;

        return await sequelize.query(query, { type: QueryTypes.SELECT });
    }

    async createProduct(name, description, price, quantity, imageUrl, brandId, categoryId, date_added) {
        return this.Product.create({
            Name: name,
            Description: description,
            Price: price,
            Quantity: quantity,
            ImageUrl: imageUrl,
            BrandId: brandId,
            CategoryId: categoryId,
            Date_Added: date_added,
        });
    }

    async updateProduct(productId, name, description, price, quantity, imageUrl, brandId, categoryId, date_added) {
        const product = await this.Product.findOne({ where: { Id: productId } });
        if (!product) {
            return null;
        }

        return product.update({
            Name: name,
            Description: description,
            Price: price,
            Quantity: quantity,
            ImageUrl: imageUrl,
            BrandId: brandId,
            CategoryId: categoryId,
            Date_Added: date_added,
        });
    }

    async softDeleteProduct(productId, name) {
        const product = await this.Product.findOne({ where: { Id: productId } });
        if (!product) {
            return null;
        }

        return product.update({  
            isDeleted: true,
        });
    }
}

module.exports = ProductService;
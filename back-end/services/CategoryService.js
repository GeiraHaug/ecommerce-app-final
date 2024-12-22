class CategoryService {
    constructor(db) {
        this.Category = db.Category;
    }

    async getAllCategories() {
        return this.Category.findAll();
    }

    async createCategory(name) {
        return this.Category.create({ Name: name });
    }

    async updateCategory(categoryId, name) {
        const category = await this.Category.findOne({ where: { Id: categoryId } });
        if (!category) {
            return null;
        }
        return category.update({ Name: name });
    }

    async deleteCategory(categoryId) {
        const category = await this.Category.findOne({ where: { Id: categoryId } });
        if (!category) {
            return null;
        }
        return category.destroy();
    }
}

module.exports = CategoryService;
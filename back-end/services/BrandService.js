class BrandService {
    constructor(db) {
        this.Brand = db.Brand;
    }

    async getAllBrands() {
        return this.Brand.findAll();
    }

    async createBrand(name) {
        return this.Brand.create({ Name: name });
    }

    async updateBrand(brandId, name) {
        const brand = await this.Brand.findOne({ where: { Id: brandId } });
        if (!brand) {
            return null;
        }
        return brand.update({ Name: name });
    }

    async deleteBrand(brandId) {
        const brand = await this.Brand.findOne({ where: { Id: brandId } });
        if (!brand) {
            return null;
        }
        return brand.destroy();
    }
}

module.exports = BrandService;
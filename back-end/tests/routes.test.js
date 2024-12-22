const request = require('supertest');
const app = require('../app');
const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const db = require('../models');

app.use(bodyParser.json());
app.use("/categories", require("../routes/categories"));
app.use("/brands", require("../routes/brands"));

const mockToken = jsonwebtoken.sign(
  { userId: 1, role: 'Admin' },
  process.env.TOKEN_SECRET,
  { expiresIn: '2h' }
);

describe("1. Add a category with the name TEST_CATEGORY", () => {
  test("POST /categories - success", async () => {
    const categoryObject = { name: "TEST_CATEGORY" };

    const { body } = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${mockToken}`)
      .send(categoryObject);

    expect(body).toEqual({
      status: "success",
      statuscode: 201,
      data: {
        result: "Category created successfully.",
        category: {
          Id: expect.any(Number),
          Name: "TEST_CATEGORY",
        },
      },
    });
  });
});

describe("2. Add a brand with the name TEST_BRAND", () => {
  test("POST /brands - success", async () => {
    const brandObject = { name: "TEST_BRAND" };

    const { body } = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${mockToken}`)
      .send(brandObject);

    expect(body).toEqual({
      status: "success",
      statuscode: 201,
      data: {
        result: "Brand created successfully.",
        brand: {
          Id: expect.any(Number),
          Name: "TEST_BRAND",
        },
      },
    });
  });
});

describe("3. Add a product with the name TEST_PRODUCT, brand must be TEST_BRAND, and category must be TEST_CATEGORY, quantity 10, price 99.99", () => {
  test("POST /products - success", async () => {
    const { body: categoryBody } = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${mockToken}`);

    const category = categoryBody.data.categories.find(
      (c) => c.Name === "TEST_CATEGORY"
    );
    const categoryId = category.Id;

    const { body: brandBody } = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${mockToken}`);

    const brand = brandBody.data.brands.find((b) => b.Name === "TEST_BRAND");
    const brandId = brand.Id;

    const productObject = {
      name: "TEST_PRODUCT",
      description: "This is a test product",
      price: 99.99,
      quantity: 10,
      imageUrl: "http://example.com/image.jpg",
      brandId,
      categoryId,
    };

    const { body } = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${mockToken}`)
      .send(productObject);

    expect(body).toEqual({
      status: "success",
      statuscode: 201,
      data: {
        result: "Product created successfully.",
        product: {
          Id: expect.any(Number),
          Name: "TEST_PRODUCT",
          Description: "This is a test product",
          Price: 99.99,
          Quantity: 10,
          ImageUrl: "http://example.com/image.jpg",
          BrandId: brandId,
          CategoryId: categoryId,
          isDeleted: false,
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
        },
      },
    });
  });
});

describe("4. Get the newly created TEST_PRODUCT with all the information, including category and brand name.", () => {
  test("GET /products - success", async () => {
    const { body } = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${mockToken}`);

    const product = body.data.products.find((p) => p.name === "TEST_PRODUCT");

    expect(product).toMatchObject({
      id: expect.any(Number),
      name: "TEST_PRODUCT",
      description: "This is a test product",
      price: "99.99",
      quantity: 10,
      imageUrl: "http://example.com/image.jpg",
      BrandId: expect.any(Number),
      CategoryId: expect.any(Number),
      brand: "TEST_BRAND",
      category: "TEST_CATEGORY",
    });
  });
});

describe("5. Update the category name TEST_CATEGORY to TEST_CATEGORY2.", () => {
  test("PUT /categories/:categoryId - success", async () => {
    const { body: categoriesBody } = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${mockToken}`);

    const category = categoriesBody.data.categories.find((c) => c.Name === "TEST_CATEGORY");
    const categoryId = category.Id;
    const updatedCategoryObject = { name: "TEST_CATEGORY2" };

    const { body: updateBody } = await request(app)
      .put(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${mockToken}`)
      .send(updatedCategoryObject);

    expect(updateBody).toEqual({
      status: "success",
      statuscode: 200,
      data: {
        result: "Category updated successfully.",
        category: {
          Id: categoryId,
          Name: "TEST_CATEGORY2",
        },
      },
    });
  });
});

describe("6. Update the brand name TEST_BRAND to TEST_BRAND2.", () => {
  test("PUT /brands/:brandId - success", async () => {
    const { body: brandsBody } = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${mockToken}`);

    const brand = brandsBody.data.brands.find((b) => b.Name === "TEST_BRAND");
    const brandId = brand.Id;
    const updatedBrandObject = { name: "TEST_BRAND2" };

    const { body: updateBody } = await request(app)
      .put(`/brands/${brandId}`)
      .set("Authorization", `Bearer ${mockToken}`)
      .send(updatedBrandObject);

    expect(updateBody).toEqual({
      status: "success",
      statuscode: 200,
      data: {
        result: "Brand updated successfully.",
        brand: {
          Id: brandId,
          Name: "TEST_BRAND2",
        },
      },
    });
  });
});

describe("7. Get the product TEST_PRODUCT with all the information, including category and brand name.", () => {
  test("GET /products - retrieve TEST_PRODUCT details", async () => {
    const { body: productsBody } = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${mockToken}`);

    const product = productsBody.data.products.find(
      (p) => p.name === "TEST_PRODUCT"
    );

    expect(product).toEqual({
      id: expect.any(Number),
      name: "TEST_PRODUCT",
      description: "This is a test product",
      price: "99.99",
      quantity: 10,
      imageUrl: "http://example.com/image.jpg",
      date_added: null,
      BrandId: expect.any(Number),
      CategoryId: expect.any(Number),
      brand: "TEST_BRAND2",
      category: "TEST_CATEGORY2",
      isDeleted: 0,
      createdAt: expect.any(String),
    });
  });
});

describe("8. Delete the TEST_PRODUCT", () => {
  test("DELETE /products/:productId - success", async () => {
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${mockToken}`);

    const product = response.body.data.products.find(
      (p) => p.name === "TEST_PRODUCT"
    );

    const { body } = await request(app)
      .delete(`/products/${product.id}`)
      .set("Authorization", `Bearer ${mockToken}`);

    expect(body).toEqual({
      status: "success",
      statuscode: 200,
      data: {
        result: "Product deleted successfully.",
      },
    });
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
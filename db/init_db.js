const {
  client,
  createProducts,
  createUser,
  createReview,
  // declare your model imports here
  // for example, User
} = require("./");

async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order
    console.log("Dropping all tables...");
    await client.query(`
    DROP TABLE IF EXISTS reviews ;
    DROP TABLE IF EXISTS orderDetails;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products; 
    DROP TABLE IF EXISTS users;
    
    `);
    console.log("Finished dropping tables...");
    // DROP TABLE IF EXISTS users;
    // build tables in correct order
    console.log("Starting to build tables...");
    await client.query(`
    
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "isAdmin" BOOLEAN DEFAULT false
    );

    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL (10, 2),
      "inventoryQTY" INTEGER,
      category VARCHAR(255) NOT NULL,
      "productImg" VARCHAR(255) not null
    );

    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id) NOT NULL,
      orderTotal DECIMAL(10, 2) NOT NULL,
      createdAt TIMESTAMP
    );

    CREATE TABLE orderDetails(
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES orders(id) NOT NULL,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      quantity INTEGER, 
      unitPrice DECIMAL(10, 2),
      createdAt TIMESTAMP
    );

    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      "creatorId" INTEGER REFERENCES users(id) NOT NULL, 
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      UNIQUE("creatorId","productId"), 
      title VARCHAR(255) DEFAULT NULL,
      UNIQUE("productId",title),
      rating INTEGER DEFAULT 0,
      comment TEXT NOT NULL
    );
    `);

    console.log("Finished building tables...");
  } catch (error) {
    throw error;
  }
}

async function populateInitialUsers() {
  console.log("Starting to populate users...");
  try {
    const usersToPopulate = [
      {
        username: "bigrubes",
        password: "fullstack1",
        email: "bigrubes@gmail.com",
        isAdmin: false,
      },
      {
        username: "numnum",
        password: "fullstack2",
        email: "numnum@gmail.com",
        isAdmin: false,
      },
      {
        username: "kaiser",
        password: "fullstack3",
        email: "kaiser@gmail.com",
        isAdmin: false,
      },
      {
        username: "daisyduck",
        password: "fullstack4",
        email: "daisyduck@gmail.com",
        isAdmin: false,
      },
      {
        username: "remote",
        password: "controllers",
        email: "remotecontrollers@gmail.com",
        isAdmin: true,
      },
    ];
    const users = await Promise.all(usersToPopulate.map(createUser));

    console.log("Users populated:");
    // console.log(users);
    console.log("Finished populating users!");
  } catch (error) {
    console.error("Error populating users!");
    throw error;
  }
}

async function populateInitialProducts() {
  try {
    console.log("Starting to create products...");

    const productsToCreate = [
      {
        name: " Winter Warm Knitted Hat ",
        description:
          "Small Medium Dogs Pets Winter Warm Knitted Hat with Ear Holes",
        price: 16.99,
        inventoryQTY: 40,
        category: "Dog Hats",
        productImg:
          "https://m.media-amazon.com/images/I/61jkrNhaRhL._AC_SX466_.jpg",
      },
      {
        name: "Christmas Dog Hat ",
        description:
          "Christmas Dog Hat Crocheted Snood Funny Pet Cap with Pompon Red Green Warm Winter Dog Hat Knit Snood Headwear for Pets & Women & Men (Red, XS) ",
        price: 14.89,
        inventoryQTY: 50,
        category: "Dog Hats",
        productImg:
          "https://m.media-amazon.com/images/I/51F61OnYBwL._AC_SX466_.jpg",
      },
      {
        name: "Mini Cute Pet Hat with Adjustable Elastic Chin Strap",
        description:
          "8 Pieces Mini Cute Pet Hat with Adjustable Elastic Chin Strap, Snake Hamster Lizard Guinea Pig Knitted Hat Small Reptile Animal Decoration Supplies Lovely Accessories",
        price: 10.99,
        inventoryQTY: 10,
        category: "Hamster Hats",
        productImg:
          "https://m.media-amazon.com/images/I/81t9RCQT3NL._AC_SY355_.jpg",
      },
    ];
    const products = await Promise.all(productsToCreate.map(createProducts));

    console.log("products created:");
    // console.log(products);

    console.log("Finished creating products!");
  } catch (error) {
    console.error("Error creating products!");
    throw error;
  }
}

async function populateInitialReviews() {
  console.log("Starting to create reviews...");
  try {
    const reviewsToCreate = [
      {
        title: "Fantastic set!",
        comment: "This is a great set for all your adorable pets",
        rating: 5,
        productId: 3,
        creatorId: 5,
      },
      {
        title: "Highly recommend!",
        comment: "Great christmas gift for friends",
        rating: 4,
        productId: 2,
        creatorId: 3,
      },
      {
        title: "Got the job done",
        comment: "Didn't wow me, but it did what I needed it to do",
        rating: 3,
        productId: 3,
        creatorId: 2,
      },
      {
        title: "Fantastic set!",
        comment: "This is a great set for all your adorable pets",
        rating: 3,
        productId: 1,
        creatorId: 1,
      },
      {
        comment: "This is a great set for all your adorable pets",
        productId: 2,
        creatorId: 5,
      },
    ];

    const reviews = await Promise.all(reviewsToCreate.map(createReview));
    console.log("reviews created: ");
    // console.log(reviews);

    console.log("Finished creating reviews");
  } catch (error) {
    console.error("Error creating reviews");
    throw error;
  }
}

// async function populateInitialData() {
//   try {
//   } catch (error) {
//     throw error;
//   }
// }

buildTables()
  .then(populateInitialUsers)
  .then(populateInitialProducts)
  .then(populateInitialReviews)
  .catch(console.error)
  .finally(() => client.end());

module.exports = {
  buildTables,
};

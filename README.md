<p align="center">
  <a href="https://www.medusa-commerce.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/129161578-19b83dc8-fac5-4520-bd48-53cba676edd2.png" width="100" />
  </a>
</p>
<h1 align="center">
  Medusa Starter Default
</h1>
<p align="center">
This repo provides the skeleton to get you started with using <a href="https://github.com/medusajs/medusa">Medusa</a>. Follow the steps below to get ready.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Prerequisites

This starter has minimal prerequisites and most of these will usually already be installed on your computer.

- [Install Node.js](https://nodejs.org/en/download/)
- [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Install SQLite](https://www.sqlite.org/download.html)

## Setting up your store

- Install the Medusa CLI
  ```
  npm install -g @medusajs/medusa
  yarn global add @medusajs/medusa
  ```
- Create a new Medusa project
  ```
  medusa new my-medusa-store
  ```
- Run your project
  ```
  cd my-medusa-store
  medusa develop
  ```

Your local Medusa server is now running on port **9000**.

### Seeding your Medusa store

---

To seed your medusa store run the following command:

```
medusa seed -f ./data/seed.json
```

This command seeds your database with some sample datal to get you started, including a store, an administrator account, a region and a product with variants. What the data looks like precisely you can see in the `./data/seed.json` file.

## Setting up your store with Docker

- Install the Medusa CLI
  ```
  npm install -g @medusajs/medusa-cli
  ```
- Create a new Medusa project
  ```
  medusa new my-medusa-store
  ```
- Update project config in `medusa-config.js`:

  ```
  module.exports = {
    projectConfig: {
      redis_url: REDIS_URL,
      database_url: DATABASE_URL, //postgres connectionstring
      database_type: "postgres",
      store_cors: STORE_CORS,
      admin_cors: ADMIN_CORS,
    },
    plugins,
  };
  ```

- Run your project

  When running your project the first time `docker compose` should be run with the `build` flag to build your contianer locally:

  ```
  docker compose up --build
  ```

  When running your project subsequent times you can run docker compose with no flags to spin up your local environment in seconds:

  ```
  docker compose up
  ```

Your local Medusa server is now running on port **9000**.

### Seeding your Medusa store with Docker

---

To add seed data to your medusa store runnign with Docker, run this command in a seperate terminal:

```
docker exec medusa-server medusa seed -f ./data/seed.json
```

This will execute the previously described seed script in the running `medusa-server` Docker container.

## Try it out

```
curl -X GET localhost:9000/store/products | python -m json.tool
```

After the seed script has run you will have the following things in you database:

- a User with the email: admin@medusa-test.com and password: supersecret
- a Region called Default Region with the countries GB, DE, DK, SE, FR, ES, IT
- a Shipping Option called Standard Shipping which costs 10 EUR
- a Product called Cool Test Product with 4 Product Variants that all cost 19.50 EUR

Visit [docs.medusa-commerce.com](https://docs.medusa-commerce.com) for further guides.

<p>
  <a href="https://www.medusa-commerce.com">
    Website
  </a> 
  |
  <a href="https://medusajs.notion.site/medusajs/Medusa-Home-3485f8605d834a07949b17d1a9f7eafd">
    Notion Home
  </a>
  |
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    Twitter
  </a>
  |
  <a href="https://docs.medusa-commerce.com">
    Docs
  </a>
</p>

# Structure

- Models (`/models`)
This is where the data layer lives. Define data models here no logic only schema and data access layer. (Default is MongoDB so we have data access layer defined for us already)

- Services (`/services`)
This is where our business logic lives. Define services that perform calculations, update the data layer, synchronize services, etc.

- Controllers (`/api`)
This is the interface lives. Define how the user interacts with the service layer. Ensure that the user has permission to do what they intend to, authenticate requests, call service layer.

- Jobs (`/jobs`)
This is where background and recurring tasks live. Want to send some data somewhere every night, this would be where to do it. Calls service layer methods and should, like controllers, not contain business logic.

- Subscribers (`/subscribers`)
This is where events live. Want to perform a certain task whenever something else happens, this is where to do it.

# Extending the core

The core will look for files in the folders listed above, and inject the custom code.


# Checkout flow

To create an order from a cart the customer must have filled in:
- their details (shipping/billing address, email)
- shipping method 
- payment method

To create a cart have to post on a saved region to the url: 
http://localhost:9000/store/carts
payload:
```
  {
        "region_id":"reg_01G5CS8NM4ZAW0RKK52Q3XMPQ5"
  }
```

The steps can be done in any order. The standard path would probably be:

1. submit details (PUT /cart/shipping-address, PUT /cart/email)
2. select shipping method (PUT /cart/shipping-method)
3. enter payment details (PUT /cart/payment-method) 
4. complete order (POST /order)

Assuming that shipping methods are static within each region we can display all shipping methods at checkout time. If shipping is dynamically calculated the price of the shipping method may change, we will ask the fulfillment provider for new rates. 

Payment details can be entered at any point as long as the final amount is known. If the final amount changes after the payment details are entered the payment method may therefore be invalidated.

Within the store UI you could imagine each step being taken care of by a single button click, which calls all endpoints.

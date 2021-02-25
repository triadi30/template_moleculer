const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");

const brokerNode1 = new ServiceBroker({
  namespace: "dev",
  nodeID: "node-1",
  transporter: "NATS"
});

brokerNode1.createService({
  name: "gateway",
  mixins: [HTTPServer],

  settings: {
    port: process.env.PORT || 3007,
    ip: "0.0.0.0",
    use: [],
    routes: [
      {
        path: "/api",
        aliases: {
          "GET products": "products.listProducts",

          "GET users": "users.listUsers",
          "GET users/:id": "users.getUsers",
          "POST users": "users.createUsers",
          "DELETE users/:id": "users.deleteUsers",
          "PUT users/:id": "users.updateUsers",

          "GET logger": "logger.listLogger",
          "GET logger/:id": "logger.getLogger",
          "POST logger": "logger.createLogger",
          "DELETE logger/:id": "logger.deleteLogger",
          "PUT logger/:id": "logger.updateLogger",

          "GET transaction": "transaction.listTransaction",
          "GET transaction/:id": "transaction.getTransaction",
          "POST transaction": "transaction.createTransaction",
          "DELETE transaction/:id": "transaction.deleteTransaction",
          "PUT transaction/:id": "transaction.updateTransaction",
        }
      }
    ]
  },

  actions: {
    home: {
        async handler() {
            return "My Home";
        }
    },
    welcome: {
        params: {
            name: "string"
        },
        async handler(ctx) {
            return `Welcome, ${ctx.params.name}`;
        }
    }
  }
});


// const brokerNode2 = new ServiceBroker({
//   namespace: "dev",
//   nodeID: "node-2",
//   transporter: "NATS"
// });

// brokerNode2.createService({
//   name: "products",

//   actions: {
//     listProducts: {
//       async handler(ctx) {
//         return this.getProducts();
//       }
//     }
//   },
//   methods: {
//     getProducts: () => {
//       return new Promise((resolve) => {
//         resolve([
//           { name: "Apples", price: 5 },
//           { name: "Oranges", price: 3 },
//           { name: "Bananas", price: 2 }
//         ]);
//       });
//     }
//   }
// });

// Start both brokers
Promise.all([brokerNode1.start()]).then(() => {
  brokerNode1.repl();
});
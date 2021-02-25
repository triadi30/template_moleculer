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

// Start brokers
Promise.all([brokerNode1.start()]).then(() => {
  brokerNode1.repl();
});

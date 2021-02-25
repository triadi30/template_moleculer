const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");

const brokerNode2 = new ServiceBroker({
  namespace: "dev",
  nodeID: "node-2",
  transporter: "NATS"
});

brokerNode2.createService({
  name: "users",
  mixins: [DbService],

  settings: {
    fields: ["_id", "name", "email", "address"],
    entityValidator: {
			name: "string"
		}
   },

  actions: {
    listUsers: {
    	async handler(ctx) {
    		return this.broker.call("users.find", {});
    	}
    },
    createUsers: {
         params: {
              name: { type: "string", min: 2 },
              email: { type: "email", min: 1 },
              address: {type: "string", min:5}
            },
    	async handler(ctx) {
    		return this.broker.call("users.create", ctx.params);
    	}
    },
    updateUsers: {
         params: {
              name: { type: "string", min: 2 },
              email: { type: "email", min: 1 },
              address: {type: "string", min:5}
            },
    	async handler(ctx) {
    		return this.broker.call("users.create", ctx.params);
    	}
    },
    deleteUsers: {
    	async handler(ctx) {
    		return this.broker.call("users.remove", ctx.params);
    	}
    },
  },
});

const brokerNode3 = new ServiceBroker({
  namespace: "dev",
  nodeID: "node-3",
  transporter: "NATS"
});

brokerNode3.createService({
  name: "transaction",
  mixins: [DbService],

  settings: {
    fields: ["_id", "to", "from", "value"],
      entityValidator: {
				to: "string",
                from: "string",
			}
   },

  actions: {
    listTransaction: {
    	async handler(ctx) {
    		return this.broker.call("transaction.find", {});
    	}
    },
    getTransaction: {
        params: {
            id: { type: "string" }
        },

    	async handler(ctx) {
            const id = ctx.params.id;
    		return this.broker.call("transaction.get", { id: id });
    	}
    },
    createTransaction: {
        params: {
              to: { type: "string"},
              from: { type: "string"},
              value: {type: "string"}
            },
    	async handler(ctx) {
    		return this.broker.call("transaction.create", ctx.params);
    	}
    },
    deleteTransaction: {
        params: {
            id: { type: "string" }
        },

    	async handler(ctx) {
    		return this.broker.call("transaction.remove", { id: ctx.params.id });
    	}
    },
    updateTransaction: {
         params: {
              to: { type: "string", optional: true} ,
              from: { type: "string", optional: true},
              value: {type: "string", optional: true}
            },
    	async handler(ctx) {
    		return this.broker.call("transaction.update", ctx.params);
    	}
    },
  },

  afterConnected() {
  	
  }
});

Promise.all([brokerNode2.start(), brokerNode3.start()]).then(() => {
  brokerNode3.repl();
});
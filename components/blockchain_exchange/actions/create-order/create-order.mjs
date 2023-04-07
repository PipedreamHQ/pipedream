import app from "../../blockchain_exchange.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "blockchain_exchange-create-order",
  name: "Create Order",
  description: "Place a new order on the trading platform. [See the docs](https://api.blockchain.com/v3/#/trading/createOrder).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    clOrdID: {
      propDefinition: [
        app,
        "clOrdID",
      ],
    },
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
    side: {
      propDefinition: [
        app,
        "side",
      ],
    },
    orderQty: {
      propDefinition: [
        app,
        "orderQty",
      ],
    },
    ordType: {
      propDefinition: [
        app,
        "ordType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const { ordType } = this;

    if (!ordType) {
      return {};
    }

    const {
      timeInForce,
      ...additionalFields
    } =
      constants.FIELD[ordType]
      || constants.FIELD[constants.ORDER_TYPE.LIMIT];

    return {
      timeInForce: {
        ...timeInForce,
        options: this.getTimeInForceOptions(),
      },
      ...additionalFields,
    };
  },
  methods: {
    getTimeInForceOptions() {
      const allOptions = [
        constants.ORDER_TYPE.MARKET,
        constants.ORDER_TYPE.LIMIT,
      ];
      if (allOptions.includes(this.ordType)) {
        return Object.values(constants.TIME_IN_FORCE);
      }
      return [
        constants.TIME_IN_FORCE.GTC,
        constants.TIME_IN_FORCE.GTD,
      ];
    },
    async createOrder(args = {}) {
      const subscription = await this.app.sendMessage({
        action: constants.ACTION.SUBSCRIBE,
        channel: constants.CHANNEL.TRADING,
      });

      if (utils.isRejected(subscription)) {
        throw new Error(JSON.stringify(order));
      }

      const order = await this.app.sendMessage({
        action: constants.TRADING_ACTION.NEW_ORDER_SINGLE,
        channel: constants.CHANNEL.TRADING,
        ...args,
      });

      if (utils.isRejected(order)) {
        throw new Error(JSON.stringify(order));
      }

      return order;
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      ...additonalProps
    } = this;

    const response = await this.createOrder(additonalProps);

    step.export("$summary", "Successfully created order");
    return response;
  },
};

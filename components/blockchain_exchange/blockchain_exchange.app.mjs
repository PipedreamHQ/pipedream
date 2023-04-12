import WebSocket from "ws";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "blockchain_exchange",
  propDefinitions: {
    clOrdID: {
      type: "string",
      label: "Client Order ID",
      description: "A unique identifier for the order. Automatically generated if not sent.",
    },
    symbol: {
      type: "string",
      label: "Symbol",
      description: "The symbol of the instrument to trade.",
      async options() {
        const { symbols } = await this.listSymbols();
        return Object.keys(symbols);
      },
    },
    side: {
      type: "string",
      label: "Side",
      description: "The side of the order.",
      options: constants.ORDER_SIDES,
    },
    orderQty: {
      type: "string",
      label: "Order Quantity",
      description: "The quantity of the order.",
    },
    ordType: {
      type: "string",
      label: "Order Type",
      description: "The type of order to place.",
      options: Object.values(constants.ORDER_TYPE),
    },
  },
  methods: {
    getApiSecret() {
      return this.$auth.api_secret;
    },
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Origin": "https://exchange.blockchain.com",
        "Content-Type": "application/json",
        "X-API-Token": this.getApiSecret(),
        ...headers,
      };
    },
    open() {
      const ws = new WebSocket(constants.WS_URL, {
        headers: this.getHeaders(),
      });
      return new Promise((resolve, reject) => {
        ws.on("error", reject);
        ws.on("open", () => resolve(ws));
      });
    },
    close(ws) {
      ws.close();
      return new Promise((resolve, reject) => {
        ws.on("error", reject);
        ws.on("close", () => resolve(ws));
      });
    },
    async sendMessage({
      predicate = () => true, ...args
    } = {}) {
      const ws = await this.open();
      const msg = JSON.stringify({
        token: this.getApiSecret(),
        ...args,
      });

      ws.send(msg);

      return new Promise((resolve, reject) => {
        ws.on("error", reject);
        ws.on("message", async (buffer) => {
          try {
            const data = JSON.parse(buffer.toString());

            if (predicate(data)) {
              await this.close(ws);
              resolve(data);
            }

          } catch (err) {
            console.log("Error closing websocket", err);
            reject(err);
          }
        });
      });
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    async listSymbols({
      action = constants.ACTION.SUBSCRIBE,
      channel = constants.CHANNEL.SYMBOLS,
      ...args
    } = {}) {
      const response = await this.sendMessage({
        predicate: ({ event }) => [
          constants.EVENT.SNAPSHOT,
          constants.EVENT.REJECTED,
        ].includes(event),
        action,
        channel,
        ...args,
      });

      if (response.event === constants.EVENT.REJECTED) {
        throw new Error(JSON.stringify(response));
      }

      return response;
    },
  },
};

import { axios }from "@pipedream/platform";
export default {
  type: "app",
  app: "ecwid",
  propDefinitions: {},
  methods: {

    async getOrders(history = 30, paymentStatus = "PAID", fulfilmentStatus = "AWAITING_PROCESSING") {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - history);
      const fromDateTimeStamp = Math.floor(fromDate.getTime() / 1000).toString();
      const res = await axios({
        url: `https://app.ecwid.com/api/v3/${this.$auth.storeId}/orders?` +
              `paymentStatus=${paymentStatus}&fulfillmentStatus=${fulfilmentStatus}&createdFrom=${fromDateTimeStamp}`,
        method: "GET",
        headers: {
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "accept": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
      console.log(res);
      return res.data.items;
    },
    async updateFulfilmentStatus(orderId, fulfilmentStatus = "PROCESSING") {
      return await axios({
        url: `https://app.ecwid.com/api/v3/${this.$auth.storeId}/orders/${orderId}`,
        method: "PUT",
        headers: {
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "accept": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data: {
          "fulfillmentStatus": fulfilmentStatus,
        },
      });
    },
  },
};

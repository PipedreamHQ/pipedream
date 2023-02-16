import planyo from "../../planyo_online_booking.app.mjs";

export default {
  props: {
    planyo,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { response_message: responseMessage } = await this.planyo.createWebhook({
        params: {
          callback_url: this.http.endpoint,
          notification_name: this.getNotificationType(),
        },
      });
      console.log(responseMessage);
    },
    async deactivate() {
      const { response_message: responseMessage } = await this.planyo.deleteWebhook({
        params: {
          callback_url: this.http.endpoint,
          notification_name: this.getNotificationType(),
        },
      });
      console.log(responseMessage);
    },
  },
};

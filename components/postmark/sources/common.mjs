import postmark from "../postmark.app.mjs";

export default {
  props: {
    postmark,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  async run(data) {
    this.http.respond({
      status: 200,
    });

    let date = new Date(data.ReceivedAt);
    let msgId = data.MessageID;

    let id = `${msgId}-${date.toISOString()}`;

    this.$emit(data, {
      id,
      summary: data.Subject,
      ts: date.valueOf(),
    });
  },
};

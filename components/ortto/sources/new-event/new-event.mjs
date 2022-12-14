import app from "../../ortto.app.mjs";

export default {
  key: "ortto-new-event",
  name: "New Event (Instant)",
  description: "Emit new event when new type of event is triggered. [See the docs](https://help.ortto.com/user/latest/data-sources/configuring-a-new-data-source/other-integrations/webhook.html#create-your-webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  async run(event) {
    const { body } = event;

    if (!body) {
      console.log("Body was not found in the event");
      return;
    }

    this.http.respond({
      status: 200,
    });

    const ts = Date.parse(body.time);
    this.$emit(body, {
      id: ts,
      summary: "New Event Triggered",
      ts,
    });
  },
};

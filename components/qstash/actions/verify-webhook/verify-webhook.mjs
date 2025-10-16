import qstash from "../../qstash.app.mjs";
import { methods } from "../../common.mjs";

export default {
  name: "Verify Webhook",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "qstash-verify-webhook",
  description: "Verify an incoming QStash webhook to an endpoint. Only to be used with the **Publish Endpoint** action.",
  props: {
    qstash,
    event: {
      type: "object",
      label: "HTTP Request",
      description: "The incoming QStash HTTP request to be verified. Use `{{ steps.trigger.event }}` as a custom expression and make sure the HTTP triggers **Event Body** option is set to **Raw Body**.",
    },
  },
  type: "action",
  methods: {
    ...methods,
  },
  async run({ $ }) {
    const signature = this.event.headers[this.event.headers.indexOf("upstash-signature") + 1];
    const keys = await this.qstash.getKeys({
      $,
    });

    const currentSigningKey = keys.current;
    const nextSigningKey = keys.next;
    const url = this.event.url.slice(0, -1);

    try {
      return await this.verify(signature, currentSigningKey, this.event.body, url);
    } catch (e) {
      console.log(e);
      return await this.verify(signature, nextSigningKey, this.event.body, url);
    }
  },
};

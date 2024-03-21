import betterStack from "../../better_stack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "better_stack-on-call-contact-changed-instant",
  name: "On-Call Contact Changed (Instant)",
  description: "Emit new event every time an on-call contact changes. [See the documentation](https://betterstack.com/docs/uptime/webhooks/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    betterStack,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    oldContactId: {
      propDefinition: [
        betterStack,
        "oldContactId",
      ],
    },
    newContactId: {
      propDefinition: [
        betterStack,
        "newContactId",
      ],
    },
    changeTime: {
      propDefinition: [
        betterStack,
        "changeTime",
      ],
    },
  },
  methods: {
    generateMeta(data) {
      const {
        oldContactId, newContactId, changeTime,
      } = data;
      const summary = `On-call contact changed from ${oldContactId} to ${newContactId}`;
      const ts = changeTime
        ? Date.parse(changeTime)
        : Date.now();
      return {
        id: `${oldContactId}-${newContactId}`,
        summary,
        ts,
      };
    },
  },
  hooks: {
    async activate() {
      // On activation, we do not need to set up anything specific for this source,
      // since the webhook should be managed externally according to the docs.
    },
    async deactivate() {
      // On deactivation, we do not need to tear down anything specific for this source,
      // since the webhook should be managed externally according to the docs.
    },
  },
  async run(event) {
    const { body } = event;

    // Validate that the necessary fields are present
    if (!body.oldContactId || !body.newContactId) {
      this.http.respond({
        status: 400,
        body: "Bad Request",
      });
      return;
    }

    const metadata = this.generateMeta(body);
    this.$emit(body, metadata);

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
};

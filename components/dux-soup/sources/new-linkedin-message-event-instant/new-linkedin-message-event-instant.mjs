import { axios } from "@pipedream/platform";
import linkedin from "../../linkedin.app.mjs";

export default {
  key: "dux-soup-new-linkedin-message-event-instant",
  name: "New LinkedIn Message Event Instant",
  description: "Emit new event when a new LinkedIn message is received. [See the documentation](https://help.dux-soup.com/en/articles/4875799-webhook-calls)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linkedin,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    messageSource: {
      propDefinition: [
        linkedin,
        "messageSource",
      ],
    },
    messageContent: {
      propDefinition: [
        linkedin,
        "messageContent",
      ],
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // validate the incoming webhook
    if (!this.linkedin.verifySignature(headers, body, this.linkedin.$auth.oauth_access_token)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const {
      type, data,
    } = body;

    // check the event type
    if (type !== "linkedin_message") {
      console.log(`Ignoring event type: ${type}`);
      return;
    }

    // emit the event
    this.$emit(data, {
      id: data.id,
      summary: `New LinkedIn message from: ${data.from}`,
      ts: Date.now(),
    });
  },
};

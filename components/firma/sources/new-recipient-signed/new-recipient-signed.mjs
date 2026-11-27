import common from "../common/webhook.mjs";
import { EVENT_RECIPIENT_SIGNED } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "firma-new-recipient-signed",
  name: "New Recipient Signed (Instant)",
  description: "Emit new event when one recipient of a Firma signing request signs. The event is Firma's webhook payload: the request is in `data.signing_request`, the recipient in `data.recipient`, and `data.all_complete` is `true` when it was the last signature. [See the documentation](https://docs.firma.dev/guides/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        EVENT_RECIPIENT_SIGNED,
      ];
    },
    getSummary({ data }) {
      const recipient = data?.recipient;
      const request = data?.signing_request;
      return `${recipient?.name || recipient?.email || "A recipient"} signed ${request?.name || request?.id}`;
    },
  },
  sampleEmit,
};

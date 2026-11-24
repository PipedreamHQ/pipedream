import common from "../common/webhook.mjs";
import { EVENT_SIGNING_REQUEST_COMPLETED } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "firma-new-signing-request-completed",
  name: "New Signing Request Completed (Instant)",
  description: "Emit new event when every recipient of a Firma signing request has signed. The event is Firma's webhook payload; the request is in `data.signing_request`. Use **Download Signed Document** to fetch the signed PDF. [See the documentation](https://docs.firma.dev/guides/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        EVENT_SIGNING_REQUEST_COMPLETED,
      ];
    },
    getSummary({ data }) {
      const request = data?.signing_request;
      return `Signing request completed: ${request?.name || request?.id}`;
    },
  },
  sampleEmit,
};

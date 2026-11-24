import common from "../common/webhook.mjs";
import { EVENT_SIGNING_REQUEST_CREATED } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "firma-new-signing-request-created",
  name: "New Signing Request Created (Instant)",
  description: "Emit new event when a Firma signing request is created, as a draft or by a create-and-send. The event is Firma's webhook payload; the request is in `data.signing_request`. [See the documentation](https://docs.firma.dev/guides/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        EVENT_SIGNING_REQUEST_CREATED,
      ];
    },
    getSummary({ data }) {
      const request = data?.signing_request;
      return `Signing request created: ${request?.name || request?.id}`;
    },
  },
  sampleEmit,
};

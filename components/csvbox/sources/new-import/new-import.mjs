import { ConfigurationError } from "@pipedream/platform";
import app from "../../csvbox.app.mjs";
import sampleEvent from "./test-event.mjs";

export default {
  key: "csvbox-new-import",
  name: "New Import",
  description: "Emit new event when CSVBox receives and processes a new import. [See documentation](https://help.csvbox.io/destinations#api-webhook)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
  },
  async run({
    headers, body,
  }) {

    if (!headers["content-type"] || headers["content-type"] !== "application/json") {
      throw new ConfigurationError("Invalid content type. Please check your CSVBox webhook configuration so that the content type is set to `JSON`.");
    }

    const ts = Date.now();

    this.$emit(body, {
      id: ts,
      summary: "New import has been processed",
      ts,
    });
  },
  sampleEvent,
};

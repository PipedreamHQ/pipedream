import { ConfigurationError } from "@pipedream/platform";
import scamchecker from "../../scamchecker.app.mjs";

export default {
  key: "scamchecker-check-message",
  name: "Check Message",
  description: "Check a suspicious email, SMS or WhatsApp message for signs of fraud, or check a link directly. Returns a verdict (`fake`, `suspicious`, `no_red_flags` or `unclear`), a summary and the signals found. [See the documentation](https://scamchecker.nl)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    scamchecker,
    messageText: {
      propDefinition: [
        scamchecker,
        "messageText",
      ],
      optional: true,
    },
    messageUrl: {
      propDefinition: [
        scamchecker,
        "messageUrl",
      ],
    },
  },
  async run({ $ }) {
    if (!this.messageText && !this.messageUrl) {
      throw new ConfigurationError("Provide a Message Text or a Message URL to check.");
    }

    const check = await this.scamchecker.checkMessage($, {
      text: this.messageText,
      url: this.messageUrl,
    });

    const verdictLabel = (check.verdict ?? "unknown").replace(/_/g, " ");
    $.export("$summary", `Check complete: verdict "${verdictLabel}"`);

    return check;
  },
};

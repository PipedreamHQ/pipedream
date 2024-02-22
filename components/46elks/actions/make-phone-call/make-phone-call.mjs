import { axios } from "@pipedream/platform";
import fortySixElks from "../../46elks.app.mjs";

export default {
  key: "46elks-make-phone-call",
  name: "Make Phone Call",
  description: "Dials and connects two phone numbers using the 46elks service. [See the documentation](https://46elks.com/docs/overview)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fortySixElks,
    from: {
      propDefinition: [
        fortySixElks,
        "from",
      ],
    },
    to: {
      propDefinition: [
        fortySixElks,
        "to",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fortySixElks.dialNumbers({
      from: this.from,
      to: this.to,
    });

    $.export("$summary", `Successfully connected from ${this.from} to ${this.to}`);
    return response;
  },
};

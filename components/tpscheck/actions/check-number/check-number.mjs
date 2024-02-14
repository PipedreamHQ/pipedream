import tpscheck from "../../tpscheck.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tpscheck-check-number",
  name: "Check Number Against TPS/CTPS",
  description: "Validates a provided number against the TPS/CTPS register. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tpscheck,
    number: {
      propDefinition: [
        tpscheck,
        "number",
      ],
    },
  },
  async run({ $ }) {
    const isRegistered = await this.tpscheck.validateNumber({
      number: this.number,
    });
    $.export("$summary", `Number ${this.number} is ${isRegistered
      ? ""
      : "not "}registered with TPS/CTPS.`);
    return {
      isRegistered,
    };
  },
};

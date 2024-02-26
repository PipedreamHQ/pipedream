import nutshell from "../../nutshell.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nutshell-create-lead",
  name: "Create Lead",
  description: "Initiates a new lead within Nutshell. [See the documentation](https://developers.nutshell.com)",
  version: "0.0.1",
  type: "action",
  props: {
    nutshell,
    leadName: {
      propDefinition: [
        nutshell,
        "leadName",
      ],
    },
    source: {
      propDefinition: [
        nutshell,
        "source",
      ],
    },
    forecastedCloseDate: {
      propDefinition: [
        nutshell,
        "forecastedCloseDate",
      ],
      optional: true,
    },
    value: {
      propDefinition: [
        nutshell,
        "value",
      ],
      optional: true,
    },
    followUpDate: {
      propDefinition: [
        nutshell,
        "followUpDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nutshell.initiateLead({
      leadName: this.leadName,
      source: this.source,
      forecastedCloseDate: this.forecastedCloseDate,
      value: this.value,
      followUpDate: this.followUpDate,
    });
    $.export("$summary", `Successfully created lead with name ${this.leadName}`);
    return response;
  },
};

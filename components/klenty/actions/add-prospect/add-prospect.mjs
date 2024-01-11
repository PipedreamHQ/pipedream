import klentyApp from "../../klenty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klenty-add-prospect",
  name: "Add Prospect to List",
  description: "Adds a new prospect to a list in Klenty. [See the documentation](https://support.klenty.com/en/articles/8193937-klenty-s-post-apis)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klenty: klentyApp,
    prospectEmail: {
      propDefinition: [
        klentyApp,
        "prospectEmail",
      ],
    },
    prospectListName: {
      propDefinition: [
        klentyApp,
        "prospectListName",
      ],
    },
    prospectData: {
      propDefinition: [
        klentyApp,
        "prospectData",
      ],
    },
    jobid: {
      propDefinition: [
        klentyApp,
        "jobid",
      ],
      optional: true,
    },
    event: {
      propDefinition: [
        klentyApp,
        "event",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.klenty.addProspectToList({
      prospectListName: this.prospectListName,
      prospectData: this.prospectData,
    });

    $.export("$summary", `Successfully added prospect ${this.prospectEmail} to list ${this.prospectListName}`);
    return response;
  },
};

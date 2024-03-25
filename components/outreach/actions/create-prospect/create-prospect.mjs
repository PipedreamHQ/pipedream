import outreach from "../../outreach.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "outreach-create-prospect",
  name: "Create Prospect",
  description: "Creates a new prospect in Outreach. Required props include name and email.",
  version: "0.0.1",
  type: "action",
  props: {
    outreach,
    prospectName: {
      propDefinition: [
        outreach,
        "prospectName",
      ],
    },
    prospectEmail: {
      propDefinition: [
        outreach,
        "prospectEmail",
      ],
    },
    prospectTitle: {
      propDefinition: [
        outreach,
        "prospectTitle",
      ],
      optional: true,
    },
    prospectCompanyName: {
      propDefinition: [
        outreach,
        "prospectCompanyName",
      ],
      optional: true,
    },
    prospectPhoneNumber: {
      propDefinition: [
        outreach,
        "prospectPhoneNumber",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.outreach.createProspect({
      prospectName: this.prospectName,
      prospectEmail: this.prospectEmail,
      prospectTitle: this.prospectTitle,
      prospectCompanyName: this.prospectCompanyName,
      prospectPhoneNumber: this.prospectPhoneNumber,
    });

    $.export("$summary", `Successfully created prospect ${this.prospectName}`);
    return response;
  },
};

import outreach from "../../outreach.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "outreach-create-account",
  name: "Create Account",
  description: "Creates an account within Outreach. [See the documentation](https://developers.outreach.io/api/reference/)",
  version: "0.0.1",
  type: "action",
  props: {
    outreach,
    accountName: {
      propDefinition: [
        outreach,
        "accountName",
      ],
    },
    accountIndustry: {
      propDefinition: [
        outreach,
        "accountIndustry",
      ],
    },
    accountLocation: {
      propDefinition: [
        outreach,
        "accountLocation",
      ],
    },
    accountDescription: {
      propDefinition: [
        outreach,
        "accountDescription",
      ],
      optional: true,
    },
    accountPhoneNumber: {
      propDefinition: [
        outreach,
        "accountPhoneNumber",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.outreach.createAccount({
      accountName: this.accountName,
      accountIndustry: this.accountIndustry,
      accountLocation: this.accountLocation,
      accountDescription: this.accountDescription,
      accountPhoneNumber: this.accountPhoneNumber,
    });

    $.export("$summary", `Successfully created account ${this.accountName}`);
    return response;
  },
};

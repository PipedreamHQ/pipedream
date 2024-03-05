import fogbugz from "../../fogbugz.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fogbugz-create-case",
  name: "Create Case",
  description: "Creates a new case on FogBugz. [See the documentation](https://api.manuscript.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fogbugz,
    filterId: {
      propDefinition: [
        fogbugz,
        "filterId",
      ],
    },
    userId: {
      propDefinition: [
        fogbugz,
        "userId",
      ],
    },
    caseDetails: {
      propDefinition: [
        fogbugz,
        "caseDetails",
      ],
    },
    userDetails: {
      propDefinition: [
        fogbugz,
        "userDetails",
      ],
    },
    caseNumber: {
      propDefinition: [
        fogbugz,
        "caseNumber",
      ],
    },
    sEmail: {
      propDefinition: [
        fogbugz,
        "sEmail",
      ],
    },
    sFullName: {
      propDefinition: [
        fogbugz,
        "sFullName",
      ],
    },
    sTitle: {
      propDefinition: [
        fogbugz,
        "sTitle",
      ],
    },
    ixPerson: {
      propDefinition: [
        fogbugz,
        "ixPerson",
      ],
    },
    q: {
      propDefinition: [
        fogbugz,
        "q",
      ],
    },
    cols: {
      propDefinition: [
        fogbugz,
        "cols",
      ],
    },
  },
  async run({ $ }) {
    const caseDetails = {
      sTitle: this.sTitle,
      ...this.caseDetails,
    };

    if (this.sEmail && this.sFullName) {
      // Create a new user for the case if email and full name are provided
      await this.fogbugz.createUser({
        sEmail: this.sEmail,
        sFullName: this.sFullName,
      });
    }

    const response = await this.fogbugz.createCase({
      caseDetails,
    });
    $.export("$summary", `Successfully created case with title "${this.sTitle}"`);
    return response;
  },
};

import app from "../../linkupapi.app.mjs";
import { ACTIONS } from "../../common/constants.mjs";

export default {
  type: "action",
  key: "linkupapi-get-profile-info",
  name: "Get Profile Info",
  description: "Fetch details for a LinkedIn profile. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/get-profile)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      description: "LinkedIn profile URL. Eg. `https://www.linkedin.com/in/john-doe/`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.profiles({
      $,
      data: {
        account_id: this.accountId,
        action: ACTIONS.GET,
        params: {
          profile_url: this.linkedinUrl,
        },
      },
    });

    $.export("$summary", `Successfully retrieved profile information for ${this.linkedinUrl}`);
    return response;
  },
};

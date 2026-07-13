import { ConfigurationError } from "@pipedream/platform";
import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-profile-info",
  name: "Get Profile Info",
  description: "Fetch details for a LinkedIn profile. Identify the target by profile URL, public identifier, or profile URN. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/get-profile)",
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
      description: "LinkedIn profile URL. Eg. `https://www.linkedin.com/in/john-doe/`. Provide this, an **Identifier**, or a **Profile URN**.",
      optional: true,
    },
    identifier: {
      propDefinition: [
        app,
        "identifier",
      ],
    },
    profileUrn: {
      propDefinition: [
        app,
        "profileUrn",
      ],
    },
  },
  async run({ $ }) {
    if (!this.linkedinUrl && !this.identifier && !this.profileUrn) {
      throw new ConfigurationError("Provide a **LinkedIn URL**, an **Identifier**, or a **Profile URN** to identify the profile.");
    }
    const response = await this.app.getProfileInfo({
      $,
      accountId: this.accountId,
      params: {
        profile_url: this.linkedinUrl,
        identifier: this.identifier,
        profile_urn: this.profileUrn,
      },
    });

    $.export("$summary", `Successfully retrieved profile information for ${this.linkedinUrl || this.identifier || this.profileUrn}`);
    return response;
  },
};

import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "browser_use-update-profile",
  name: "Update Profile",
  description: "Update a Browser Use profile name or user ID. [See the documentation](https://docs.browser-use.com/cloud/api-v3/profiles/update-profile)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserUse,
    profileId: {
      propDefinition: [
        browserUse,
        "profileId",
      ],
      optional: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Updated profile name. Maximum length: `100` characters.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Updated internal user identifier from your system. Maximum length: `255` characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.name && !this.userId) {
      throw new ConfigurationError("Provide at least one field to update: Name or User ID.");
    }

    const response = await this.browserUse.updateProfile({
      $,
      profileId: this.profileId,
      data: cleanObject({
        name: this.name,
        userId: this.userId,
      }),
    });

    $.export("$summary", `Updated profile ${response.id}`);
    return response;
  },
};

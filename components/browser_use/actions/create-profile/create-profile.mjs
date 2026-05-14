import browserUse from "../../browser_use.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "browser_use-create-profile",
  name: "Create Profile",
  description: "Create a Browser Use profile to preserve cookies, local storage, and login state across sessions. [See the documentation](https://docs.browser-use.com/cloud/api-v3/profiles/create-profile)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserUse,
    name: {
      type: "string",
      label: "Name",
      description: "Optional profile name. Maximum length: `100` characters.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Optional internal user identifier from your system. Maximum length: `255` characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.createProfile({
      $,
      data: cleanObject({
        name: this.name,
        userId: this.userId,
      }),
    });

    $.export("$summary", `Created profile ${response.id}`);
    return response;
  },
};

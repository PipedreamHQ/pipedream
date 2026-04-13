import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-profile",
  name: "Get Profile",
  description: "Get your Pubrio account profile information. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getProfile({
      $,
    });
    $.export("$summary", "Successfully retrieved profile");
    return response;
  },
};

import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-profile",
  name: "Get Profile",
  description: "Get your Pubrio account profile information. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/profile",
      data: {},
    });
    $.export("$summary", "Successfully retrieved profile");
    return response;
  },
};

import app from "../../upload_post.app.mjs";

export default {
  key: "upload_post-list-linkedin-pages",
  name: "List LinkedIn Pages",
  description: "List the LinkedIn organization (company) pages the connected LinkedIn accounts administer, with their `id` (URN) and `name`, optionally only for one profile."
    + " Use the `id` field as `targetLinkedinPageId` in **Upload Video**, **Upload Photos** and **Upload Text**, and as `pageUrn` in **Get Analytics**. [See the documentation](https://docs.upload-post.com/api/get-linkedin-pages)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    profile: {
      propDefinition: [
        app,
        "user",
      ],
      description: "Only return the LinkedIn pages of the account connected to this profile, e.g. `my_brand`. Use **List Profiles** to find it (the `username` field).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listLinkedinPages({
      $,
      params: {
        profile: this.profile,
      },
    });
    const count = response?.pages?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} LinkedIn organization page${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

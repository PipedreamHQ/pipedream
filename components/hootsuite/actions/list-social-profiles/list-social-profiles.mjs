import hootsuite from "../../hootsuite.app.mjs";

export default {
  key: "hootsuite-list-social-profiles",
  name: "List Social Profiles",
  description: "Retrieves a list of social profiles for the authenticated Hootsuite account. [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/getSocialProfiles)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hootsuite,
  },
  async run({ $ }) {
    const response = await this.hootsuite.listSocialProfiles({
      $,
    });

    const length = response?.data?.length || response?.length;
    $.export("$summary", `Successfully retrieved ${length} social profile${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

import antibrow from "../../antibrow.app.mjs";

export default {
  key: "antibrow-get-account",
  name: "Get Account",
  description: "Fetch your AntiBrow plan, concurrency cap and profile usage. [See the documentation](https://antibrow.com/docs/sdk)",
  version: "0.0.1",
  type: "action",
  props: {
    antibrow,
  },
  async run({ $ }) {
    const response = await this.antibrow.getAccount({
      $,
    });
    $.export("$summary", `Plan \`${response.plan}\`, ${response.profileCount} of ${response.profileLimit} profiles used`);
    return response;
  },
};

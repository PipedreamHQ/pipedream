import antibrow from "../../antibrow.app.mjs";

export default {
  key: "antibrow-list-profiles",
  name: "List Profiles",
  description: "List the cloud-synced browser profiles on your AntiBrow account. [See the documentation](https://antibrow.com/docs/sdk)",
  version: "0.0.1",
  type: "action",
  props: {
    antibrow,
  },
  async run({ $ }) {
    const response = await this.antibrow.listProfiles({
      $,
    });
    const count = response.profiles?.length ?? 0;
    $.export("$summary", `Successfully listed ${count} profile${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

// x-pd-ai: optimized
import slack_v2 from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-user-group-options",
  name: "List User Group Options",
  description: "Retrieves available options for the User Group field. [See the documentation](https://docs.slack.dev/reference/methods/usergroups.list)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack_v2,
  },
  async run({ $ }) {
    const { usergroups } = await this.slack_v2.usergroupsList({
      throwRateLimitError: true,
    });
    const options = usergroups.map((g) => ({
      label: g.name,
      value: g.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

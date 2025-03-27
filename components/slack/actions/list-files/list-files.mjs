import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-files",
  name: "List Files",
  description: "Return a list of files within a team. [See the documentation](https://api.slack.com/methods/files.list)",
  version: "0.0.51",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    team_id: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        slack,
        "user",
      ],
      optional: true,
    },
    pageSize: {
      propDefinition: [
        slack,
        "pageSize",
      ],
    },
    numPages: {
      propDefinition: [
        slack,
        "numPages",
      ],
    },
  },
  async run({ $ }) {
    const allFiles = [];
    const params = {
      channel: this.conversation,
      user: this.user,
      team_id: this.team_id,
      page: 1,
      count: this.pageSize,
    };
    let hasMore;

    do {
      const { files } = await this.slack.listFiles(params);
      allFiles.push(...files);
      hasMore = files.length;
      params.page++;
    } while (hasMore && params.page <= this.numPages);

    $.export("$summary", `Successfully retrieved ${allFiles.length} file${allFiles.length === 1
      ? ""
      : "s"}`);

    return allFiles;
  },
};

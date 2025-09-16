import slack from "../../slack_v2_test.app.mjs";

export default {
  key: "slack_v2_test-list-files",
  name: "List Files",
  description: "Return a list of files within a team. [See the documentation](https://api.slack.com/methods/files.list)",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    addToChannel: {
      propDefinition: [
        slack,
        "addToChannel",
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
    if (this.addToChannel) {
      await this.slack.maybeAddAppToChannels([
        this.conversation,
      ]);
    } else {
      // Ensure the user is in the channel
      await this.slack.conversationsInfo({
        channel: this.conversation,
      });
    }

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

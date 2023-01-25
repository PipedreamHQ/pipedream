import common from "../common/common.mjs";
const { bitbucket } = common.props;
import constants from "../common/constants.mjs";

export default {
  ...common,
  type: "source",
  name: "New Tag (Instant)",
  key: "bitbucket-new-tag",
  description: "Emit new event when a commit is tagged. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.4",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repository",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return `repositories/${this.workspaceId}/${this.repositoryId}/hooks`;
    },
    getWebhookEventTypes() {
      return [
        "repo:push",
      ];
    },
    isNewTag(change) {
      return change.created && change.new.type === "tag";
    },
    async loadHistoricalData() {
      const tags = await this.bitbucket.getTags({
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        params: {
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      const ts = new Date().getTime();
      return tags.map((tag) => ({
        main: tag,
        sub: {
          id: `${tag.name} - ${ts}`,
          summary: `New tag ${tag.name} created`,
          ts,
        },
      }));
    },
    proccessEvent(event) {
      const {
        headers,
        body,
      } = event;
      const { changes = [] } = body.push;

      const ts = Date.parse(headers["x-event-time"]);

      changes.filter(this.isNewTag).forEach((change) => {
        this.$emit(change, {
          id: `${change.new.name} - ${ts}`,
          summary: `New tag ${change.new.name} created`,
          ts,
        });
      });
    },
  },
};

import queries from "../../common/queries.mjs";
import common from "../common/common-webhook-orgs.mjs";

export default {
  ...common,
  key: "github-new-issue-with-status",
  name: "Project Item Status Changed",
  description: "Emit new event when a project item is tagged with a specific status. Currently supports Organization Projects only. [More information here](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-items-in-your-project/adding-items-to-your-project)",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    repo: {
      ...common.props.repo,
      label: common.props.repo.label,
      description: common.props.repo.description,
      optional: true,
    },
    project: {
      propDefinition: [
        common.props.github,
        "projectV2",
        (c) => ({
          org: c.org,
          repo: c?.repo,
        }),
      ],
    },
    status: {
      propDefinition: [
        common.props.github,
        "status",
        (c) => ({
          org: c.org,
          repo: c?.repo,
          project: c.project,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "projects_v2_item",
      ];
    },
    generateMeta(item, statusName) {
      const { id } = item;
      const ts = Date.parse(item.updated_at);
      return {
        id: `${id}-${ts}`,
        summary: `Item #${id} status changed to "${statusName}"`,
        ts,
      };
    },
    isRelevant(item, statusName) {
      let isRelevant = true;
      let message = "";
      const {
        isArchived,
        fieldValueByName: { optionId },
      } = item;

      if (isArchived) {
        message = "Item is archived. Skipping...";
        isRelevant = false;
      } else if (this.status?.length && !this.status.includes(optionId)) {
        message = `Status "${statusName}". Skipping...`;
        isRelevant = false;
      }

      if (message) console.log(message);
      return isRelevant;
    },
    async getProjectItem({ nodeId }) {
      const { node } = await this.github.graphql(queries.projectItemQuery, {
        nodeId,
      });
      return node;
    },
    async processEvent(event) {
      const item = await this.getProjectItem({
        nodeId: event.projects_v2_item.node_id,
      });

      const statusName = item.fieldValueByName.name;

      if (!this.isRelevant(item, statusName)) {
        return;
      }

      console.log(`Emitting item #${item.id}`);
      const meta = this.generateMeta(item, statusName);
      this.$emit({
        event,
        item,
      }, meta);
    },
  },
  async run({ body: event }) {
    if (event.zen) {
      console.log(event.zen);
      return;
    }

    await this.processEvent(event);
  },
};

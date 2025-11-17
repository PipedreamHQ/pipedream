import queries from "../../common/queries.mjs";
import common from "../common/common-webhook-orgs.mjs";
import constants from "../common/constants.mjs";
import { getRelevantHeaders } from "../common/utils.mjs";

export default {
  ...common,
  key: "github-new-issue-with-status",
  name: "Project Item Status Changed",
  description: "Emit new event when a project item is tagged with a specific status. Currently supports Organization Projects only. [More information here](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-items-in-your-project/adding-items-to-your-project)",
  version: "0.1.9",
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
      optional: true,
    },
    itemType: {
      type: "string[]",
      label: "Filter Item Type",
      description: "The item type(s) to emit events or. If not specified, events will be emitted for all item types.",
      optional: true,
      options: constants.PROJECT_ITEM_TYPES,
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
        summary: `Item #${id} to status "${statusName}"`,
        ts,
      };
    },
    isRelevant(event) {
      const fieldChanged = event.changes?.field_value?.field_name;
      if (fieldChanged !== "Status") {
        return;
      }

      let isRelevant = true;
      let message = "";

      const statusId = event.changes.field_value.to.id;
      const itemType = event.projects_v2_item.content_type;

      if (this.status?.length && !this.status.includes(statusId)) {
        const statusName = event.changes.field_value.to.name;
        message = `Status "${statusName}". Skipping...`;
        isRelevant = false;
      } else if (this.itemType?.length && !this.itemType.includes(itemType)) {
        message = `Item type "${itemType}". Skipping...`;
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
    async processEvent({
      event, headers,
    }) {
      const item = event.projects_v2_item;

      if (!this.isRelevant(event)) {
        return;
      }

      console.log(`Emitting item #${item.id}`);

      const statusName = event.changes.field_value.to.name;
      const meta = this.generateMeta(item, statusName);
      this.$emit({
        ...event,
        ...getRelevantHeaders(headers),
      }, meta);
    },
  },
  async run({
    body: event, headers,
  }) {
    if (event.zen) {
      console.log(event.zen);
      return;
    }

    await this.processEvent({
      event,
      headers,
    });
  },
};

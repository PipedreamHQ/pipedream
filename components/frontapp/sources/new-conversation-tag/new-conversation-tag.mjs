import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-conversation-tag",
  name: "New Conversation Tag",
  description: "Emit new event when a conversation is tagged with a specific tag or any tag. [See the documentation](https://dev.frontapp.com/reference/events)",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    tagIds: {
      propDefinition: [
        common.props.frontapp,
        "tagIds",
      ],
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    _getFunction() {
      return this.frontapp.listEvents;
    },
    _getParams() {
      return {
        "q[types]": [
          "tag",
        ],
        "sort_by": "created_at",
        "sort_order": "desc",
      };
    },
    _getEmit(item) {
      const tagIdsArray = this.tagIds.map((tag) => tag.value);
      if (item.type === "tag" && tagIdsArray.includes(item.target?.data?.id)) {
        return {
          id: item.id,
          summary: `Conversation with ID: "${item.id}" was tagged as '${item.target?.data?.name}'!`,
          ts: (Math.floor(item.emitted_at / 1000)) * 1000,
        };
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(10, (item, lastTs) => item.emitted_at > lastTs);
    },
  },
  async run() {
    await this.startEvent(0, (item, lastTs) => item.emitted_at > lastTs);
  },
  sampleEmit,
};

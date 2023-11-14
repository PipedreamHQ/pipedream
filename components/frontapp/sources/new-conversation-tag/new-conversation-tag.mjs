import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-conversation-tag",
  name: "New Conversation Tag",
  description: "Emit new event when a conversation is tagged with a specific tag or any tag. [See the documentation](https://dev.frontapp.com/reference/events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    tagIds: {
      propDefinition: [
        common.props.frontapp,
        "tagIds",
      ],
      type: "string",
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    _getFunction() {
      return this.frontapp.listEvents;
    },
    _getParams(lastTs) {
      return {
        "q[after]": lastTs,
        "q[types]": [
          "tag",
        ],
      };
    },
    _getEmit(item) {
      if (item.target?.data?.id === this.tagIds.value) {
        return {
          id: item.id,
          summary: `New conversation with id: "${item.id}" was tagged as '${this.tagIds.label}'!`,
          ts: Date.parse(item.created_at),
        };
      }
    },
  },
  sampleEmit,
};

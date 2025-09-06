import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-conversation-tag",
  name: "New Conversation Tag",
  description: "Emit new event when a conversation is tagged with a specific tag or any tag. [See the documentation](https://dev.frontapp.com/reference/events)",
  version: "0.0.4",
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
    _getParams(lastTs) {
      return {
        "q[after]": lastTs,
        "q[types]": [
          "tag",
        ],
      };
    },
    _getEmit(item) {
      const tagIdsArray = this.tagIds.map((tag) => tag.value);
      if (item.type === "tag" && tagIdsArray.includes(item.target?.data?.id)) {
        return {
          id: item.id,
          summary: `New conversation with id: "${item.id}" was tagged as '${item.target?.data?.name}'!`,
          ts: Date.parse(item.created_at),
        };
      }
    },
  },
  sampleEmit,
};

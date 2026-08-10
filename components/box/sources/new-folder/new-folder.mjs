// x-pd-ai: optimized
import common from "../common/common.mjs";

export default {
  key: "box-new-folder",
  name: "New Folder Event",
  description: "Emit new event when a folder is created within the target folder (`FOLDER.CREATED`), via a Box webhook. [See the documentation](https://developer.box.com/reference/post-webhooks)",
  version: "0.0.10",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    webhookTarget: {
      propDefinition: [
        common.props.app,
        "webhookTarget",
        () => ({
          type: "folder",
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "FOLDER.CREATED",
      ];
    },
    getSummary(event) {
      return  `New folder created event with ID(${event.id})`;
    },
  },
};

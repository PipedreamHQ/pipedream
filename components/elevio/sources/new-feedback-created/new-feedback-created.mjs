import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "elevio-new-feedback-created",
  name: "New Feedback Created",
  description: "Emit new event each time new feedback is submitted by a user via the elevio widget. [See the documentation](https://api-docs.elevio.help/en/articles/85-rest-api-hub-cards).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    folder: {
      type: "string",
      label: "Folder",
      description: "The folder to which the feedback belongs.",
      options: [
        "inbox",
        "completed",
        "archive",
      ],
    },
  },
  methods: {
    ...common.methods,
    sortFn(a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    },
    isResourceRelevant(resource) {
      return resource.type?.includes("feedback");
    },
    getDateField() {
      return "created_at";
    },
    getResourceName() {
      return "cards";
    },
    getResourcesFn() {
      return this.app.listCards;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        folder: this.folder,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Feedback: ${resource.title}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};

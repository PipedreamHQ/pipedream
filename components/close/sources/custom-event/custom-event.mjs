import common from "../common.mjs";

export default {
  ...common,
  key: "close-custom-event",
  name: "New Custom Event",
  description: "Emit new event when the configured types of events are triggered. [See all possibilities](https://developer.close.com/resources/event-log/list-of-events/)",
  version: "0.1.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    objectType: {
      label: "Object Type",
      description: "Object type, e.g. 'lead'",
      type: "string",
    },
    action: {
      label: "Action",
      description: "Name of the action, e.g. 'created'",
      type: "string",
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return [
        {
          object_type: this.objectType,
          action: this.action,
        },
      ];
    },
  },
};

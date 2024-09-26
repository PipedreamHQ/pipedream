import base from "../common/base.mjs";

export default {
  ...base,
  key: "referralhero-new-subscriber-added",
  name: "New Subscriber Added",
  description: "Emit new event when a new subscriber is added",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    listId: {
      propDefinition: [
        base.props.referralhero,
        "listId",
      ],
    },
  },
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.referralhero.listSubscribers;
    },
    getArgs() {
      return {
        listId: this.listId,
        params: {
          sort_by: "registration_desc",
        },
      };
    },
    getResourceType() {
      return "subscribers";
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.id,
        summary: `New Subscriber with ID ${subscriber.id}`,
        ts: subscriber.created_at,
      };
    },
  },
};

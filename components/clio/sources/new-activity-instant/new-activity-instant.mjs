import common from "../common/webhook.mjs";
import event from "../common/event.mjs";
import model from "../common/model.mjs";
import fields from "../common/activity-fields.mjs";

export default {
  ...common,
  key: "clio-new-activity-instant",
  name: "New Activity (Instant)",
  description: "Emit new event when a new activity is created in Clio. [See the documentation](https://docs.developers.clio.com/api-reference/#tag/Webhooks/operation/Webhook#index)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        common.props.app,
        "fields",
      ],
      options: fields,
    },
  },
  methods: {
    ...common.methods,
    getModel() {
      return model.ACTIVITY;
    },
    getEvents() {
      return [
        event.CREATED,
      ];
    },
    generateMeta(body) {
      const resource = body.data;
      return {
        id: resource.id,
        summary: `New Activity: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};

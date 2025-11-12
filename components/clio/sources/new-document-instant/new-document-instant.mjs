import common from "../common/webhook.mjs";
import event from "../common/event.mjs";
import model from "../common/model.mjs";
import fields from "../common/document-fields.mjs";

export default {
  ...common,
  key: "clio-new-document-instant",
  name: "New Document (Instant)",
  description: "Emit new event when a new document is created. [See the documentation](https://docs.developers.clio.com/api-reference/#tag/Webhooks/operation/Webhook#index)",
  version: "0.0.4",
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
      return model.DOCUMENT;
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
        summary: `New Document: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};

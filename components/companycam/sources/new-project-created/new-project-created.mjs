import common from "../common/webhook.mjs";
import scopes from "../common/scopes.mjs";

export default {
  ...common,
  key: "companycam-new-project-created",
  name: "New Project Created (Instant)",
  description: "Emit new event when a new project is created. [See the docs](https://docs.companycam.com/docs/webhooks-1).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScopes() {
      return [
        scopes.PROJECT_CREATED,
      ];
    },
    generateMeta(resource) {
      const { payload } = resource;
      return {
        id: payload.project.id,
        summary: `New Project: ${payload.project.name}`,
        ts: resource.created_at,
      };
    },
  },
};

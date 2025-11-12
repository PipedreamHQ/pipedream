import common from "../common/webhook.mjs";
import scopes from "../common/scopes.mjs";

export default {
  ...common,
  key: "companycam-project-labeled",
  name: "Project Labeled (Instant)",
  description: "Emit new event when a project is labeled. [See the docs](https://docs.companycam.com/docs/webhooks-1).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScopes() {
      return [
        scopes.PROJECT_LABEL_ADDED,
      ];
    },
    generateMeta(resource) {
      const { payload } = resource;
      const ts = resource.created_at;
      return {
        id: `${payload.label.id}-${ts}`,
        summary: `Project Labeled: ${payload.label.value}`,
        ts,
      };
    },
  },
};

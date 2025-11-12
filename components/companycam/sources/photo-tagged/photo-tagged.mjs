import common from "../common/webhook.mjs";
import scopes from "../common/scopes.mjs";

export default {
  ...common,
  key: "companycam-photo-tagged",
  name: "Photo Tagged (Instant)",
  description: "Emit new event when a photo is tagged. [See the docs](https://docs.companycam.com/docs/webhooks-1).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScopes() {
      return [
        scopes.PHOTO_TAG_ADDED,
      ];
    },
    generateMeta(resource) {
      const { payload } = resource;
      const ts = resource.created_at;
      return {
        id: `${payload.tag.id}-${ts}`,
        summary: `Photo Tagged: ${payload.tag.value}`,
        ts,
      };
    },
  },
};

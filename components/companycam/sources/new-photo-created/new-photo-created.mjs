import common from "../common/webhook.mjs";
import scopes from "../common/scopes.mjs";

export default {
  ...common,
  key: "companycam-new-photo-created",
  name: "New Photo Created (Instant)",
  description: "Emit new event when a new photo is uploaded. [See the docs](https://docs.companycam.com/docs/webhooks-1).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScopes() {
      return [
        scopes.PHOTO_CREATED,
      ];
    },
    generateMeta(resource) {
      const { payload } = resource;
      return {
        id: payload.photo.id,
        summary: `New Photo: ${payload.photo.id}`,
        ts: resource.created_at,
      };
    },
  },
};

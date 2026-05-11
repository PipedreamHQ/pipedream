import gettyImages from "../../getty_images.app.mjs";

export default {
  key: "getty_images-new-image-instant",
  name: "New Image (Instant)",
  description: "Emit new event when a new image is added to the user's Getty Images library. Configure your Getty Images account to send webhook events to this source's URL. Optionally filter events by collection code or license type.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gettyImages,
    http: "$.interface.http",
    db: "$.service.db",
    collectionCode: {
      type: "string",
      label: "Collection Code",
      description: "Only emit events for images belonging to this collection (e.g. `STO` for Stone). Leave blank to receive events for all collections.",
      optional: true,
    },
    licenseModel: {
      propDefinition: [
        gettyImages,
        "licenseModel",
      ],
    },
  },
  methods: {
    generateMeta(body) {
      return {
        id: body.id,
        summary: body.title
          ? `New image: ${body.title} (${body.id})`
          : `New image added: ${body.id}`,
        ts: body.date_added
          ? Date.parse(body.date_added)
          : Date.now(),
      };
    },
  },
  async run({ body }) {
    if (this.collectionCode && body.collection_code !== this.collectionCode) {
      return;
    }
    if (this.licenseModel && body.license_model !== this.licenseModel) {
      return;
    }
    this.$emit(body, this.generateMeta(body));
  },
};

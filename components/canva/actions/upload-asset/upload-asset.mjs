import canva from "../../canva.app.mjs";

export default {
  key: "canva-upload-asset",
  name: "Upload Asset",
  description: "Uploads an asset to Canva and emits an event when the status of the transfer payment changes. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/create-asset-upload-job/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    canva,
    assetId: {
      propDefinition: [
        canva,
        "assetId",
      ],
    },
    externalFile: {
      propDefinition: [
        canva,
        "externalFile",
      ],
    },
    importMetadata: {
      propDefinition: [
        canva,
        "importMetadata",
      ],
    },
    status: {
      propDefinition: [
        canva,
        "status",
        async (opts) => {
          const entities = await this.canva.listEntities();
          return entities.map((entity) => ({
            label: entity.status,
            value: entity.status,
          }));
        },
      ],
    },
  },
  async run({ $ }) {
    const entities = await this.canva.listEntities();
    const entity = entities.find((entity) => entity.status === this.status);

    if (entity) {
      this.canva.emitStatusChangeEvent(this.status);
      $.export("$summary", `Status changed to ${this.status}`);
      return entity;
    } else {
      $.export("$summary", `No entity with status ${this.status} found`);
      return {};
    }
  },
};

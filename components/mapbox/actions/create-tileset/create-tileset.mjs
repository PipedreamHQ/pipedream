import mapbox from "../../mapbox.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mapbox-create-tileset",
  name: "Create Tileset",
  description: "Uploads and creates a new tileset from a data source. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mapbox,
    sourceFile: {
      propDefinition: [
        "mapbox",
        "sourceFile",
      ],
    },
    tilesetName: {
      propDefinition: [
        "mapbox",
        "tilesetName",
      ],
    },
    description: {
      propDefinition: [
        "mapbox",
        "description",
      ],
    },
    privacySettings: {
      propDefinition: [
        "mapbox",
        "privacySettings",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mapbox.uploadTileset({
      sourceFile: this.sourceFile,
      tilesetName: this.tilesetName,
      description: this.description,
      privacySettings: this.privacySettings,
    });
    $.export("$summary", `Created tileset ${this.tilesetName}`);
    return response;
  },
};

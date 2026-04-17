import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-list-layer-fields",
  name: "List Layer Fields",
  description:
    "List all fields (columns) on a Feature Service layer, including name, alias, type, and whether the field is editable. [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/layer-feature-service/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    arcgisOnline,
    featureService: {
      propDefinition: [
        arcgisOnline,
        "featureService",
      ],
    },
    layerId: {
      propDefinition: [
        arcgisOnline,
        "layerId",
        (c) => ({
          featureService: c.featureService,
        }),
      ],
    },
  },
  async run({ $ }) {
    const fields = await this.arcgisOnline.getLayerFields({
      $,
      featureService: this.featureService,
      layerId: this.layerId,
    });

    $.export(
      "$summary",
      `Found ${fields.length} field(s)`,
    );
    return fields;
  },
};

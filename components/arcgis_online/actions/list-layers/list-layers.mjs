import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-list-layers",
  name: "List Layers",
  description:
    "List all layers in a Feature Service. Returns each layer's id, name, geometry type, and type. [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/feature-service/)",
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
  },
  async run({ $ }) {
    const {
      baseUrl, servicePath,
    } = await this.arcgisOnline.getFeatureServerPath({
      $,
      featureService: this.featureService,
    });
    const layers = await this.arcgisOnline.getLayers({
      $,
      baseUrl,
      servicePath,
    });

    const results = layers.map((l) => ({
      id: l.id,
      name: l.name,
      geometryType: l.geometryType || null,
      type: l.type || "Feature Layer",
    }));

    $.export(
      "$summary",
      `Found ${results.length} layer(s)`,
    );
    return results;
  },
};

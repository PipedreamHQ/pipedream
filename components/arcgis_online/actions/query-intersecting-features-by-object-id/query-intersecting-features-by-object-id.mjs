import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-query-intersecting-features-by-object-id",
  name: "Find Intersecting Features by Object ID",
  description:
    "Load a feature by OBJECTID from the source layer, then query target layers in the same Feature Service for spatially intersecting features. Returns per-layer attribute arrays. [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm)",
  version: "0.1.1",
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
    sourceLayerId: {
      propDefinition: [
        arcgisOnline,
        "layerId",
        (c) => ({
          featureService: c.featureService,
        }),
      ],
      label: "Source Layer",
      description:
        "Layer containing the boundary feature whose geometry drives the spatial query",
    },
    objectId: {
      propDefinition: [
        arcgisOnline,
        "objectId",
        (c) => ({
          featureService: c.featureService,
          layerId: c.sourceLayerId,
        }),
      ],
      description:
        "OBJECTID of the feature whose geometry becomes the intersect boundary",
    },
    targetLayerIds: {
      propDefinition: [
        arcgisOnline,
        "targetLayerIds",
        (c) => ({
          featureService: c.featureService,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      featureService,
      sourceLayerId,
      objectId,
      targetLayerIds,
    } = this;

    if (!featureService) {
      throw new Error("featureService is required");
    }
    if (!sourceLayerId) {
      throw new Error("sourceLayerId is required");
    }
    const objectIdStr = String(objectId).trim();
    if (!objectIdStr) {
      throw new Error("objectId is required");
    }
    if (!/^\d+$/.test(objectIdStr)) {
      throw new Error(
        `objectId must be a digits-only string; got "${objectId}"`,
      );
    }
    if (!targetLayerIds?.length) {
      throw new Error("targetLayerIds is required");
    if (!featureService) {
      throw new ConfigurationError("featureService is required");
    }
    if (!sourceLayerId) {
      throw new ConfigurationError("sourceLayerId is required");
    }
    const objectIdStr = String(objectId).trim();
    if (!objectIdStr) {
      throw new ConfigurationError("objectId is required");
    }
    if (!/^\d+$/.test(objectIdStr)) {
      throw new ConfigurationError(
        `objectId must be a digits-only string; got "${objectId}"`,
      );
    }
    if (!targetLayerIds?.length) {
      throw new ConfigurationError("targetLayerIds is required");
    }

    const { boundary } = await app.fetchFirstFeatureGeometry({
      $,
      featureService,
      layerId: sourceLayerId,
      queryParams: {
        objectIds: objectIdStr,
      },
    });

    if (!boundary) {
      throw new Error(
        `No feature found in layer '${sourceLayerId}' with OBJECTID ${objectIdStr}`,
      );
    }

    const result = await app.queryIntersectingFeaturesByGeometry({
      $,
      featureService,
      boundary,
      targetLayerIds,
    });

    const total = Object.values(result.layers || {})
      .reduce((n, l) => n + (l.count || 0), 0);
    $.export(
      "$summary",
      `Found ${total} intersecting feature(s) across ${Object.keys(result.layers || {}).length} layer(s)`,
    );

    return result;
  },
};

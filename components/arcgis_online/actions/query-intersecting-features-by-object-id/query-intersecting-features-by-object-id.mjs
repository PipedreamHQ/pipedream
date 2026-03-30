import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-query-intersecting-features-by-object-id",
  name: "Query Intersecting Features by Object ID",
  description:
    "Load one feature from the source layer by `OBJECTID` (first match only), use its geometry as the boundary, then intersect-query the target layers in the same hosted feature service. Return shape matches Query Intersecting Features by Geometry: per-layer `count` and `features` (attributes only). Uses [Feature Layer query](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm) for the boundary fetch and for spatial queries",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    arcgisOnline,
    mapTitle: {
      propDefinition: [
        arcgisOnline,
        "mapTitle",
      ],
      description:
        "Portal item ID from search, or feature service title for lookup",
    },
    layerName: {
      propDefinition: [
        arcgisOnline,
        "layerName",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
      description:
        "Layer id for the boundary feature; geometry is loaded via `objectIds` on `query`",
    },
    objectId: {
      propDefinition: [
        arcgisOnline,
        "objectId",
        (c) => ({
          mapTitle: c.mapTitle,
          layerName: c.layerName,
        }),
      ],
      description:
        "Object ID of the feature whose geometry becomes the intersect boundary (dropdown is paged; you may type an ID)",
    },
    targetLayerNames: {
      propDefinition: [
        arcgisOnline,
        "targetLayerNames",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
      description:
        "Target layer ids in the same service to intersect-query against the boundary",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      mapTitle,
      layerName,
      objectId,
      targetLayerNames,
    } = this;

    if (!mapTitle) {
      throw new Error("mapTitle is required");
    }
    if (!targetLayerNames?.length) {
      throw new Error("targetLayerNames is required");
    }
    if (!layerName) {
      throw new Error("layerName is required");
    }
    if (!objectId) {
      throw new Error("objectId is required");
    }

    const { boundary } = await app.fetchFirstFeatureGeometry({
      $,
      mapTitle,
      layerName,
      queryParams: {
        objectIds: objectId,
      },
    });

    if (!boundary) {
      throw new Error(
        `No feature found in layer id '${layerName}' with OBJECTID ${objectId}`,
      );
    }

    const result = await app.queryIntersectingFeaturesByGeometry({
      $,
      mapTitle,
      boundary,
      targetLayerNames,
    });

    const total = Object.values(result.layers || {})
      .reduce((n, l) => n + (l.count || 0), 0);
    $.export("$summary", `Found ${total} intersecting feature(s) across ${Object.keys(result.layers || {}).length} layer(s)`);

    return result;
  },
};

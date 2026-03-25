import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-query-intersecting-features-by-object-id",
  name: "Query Intersecting Features by Object ID",
  description:
    "Load one feature from the source layer by `OBJECTID` (first match only), use its geometry as the boundary, then intersect-query the target layers in the same hosted feature service. Return shape matches Query Intersecting Features by Geometry: per-layer `count` and `features` (attributes only). Uses [Feature Layer query](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm) for the boundary fetch and for spatial queries",
  version: "0.0.8",
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
        "Title of the hosted Feature Service item used to resolve the service URL",
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
        "Layer that contains the boundary feature; its geometry is loaded via `objectIds` on `query`",
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
        "Layers in the same service to query for features intersecting the boundary geometry",
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
      throw new Error(`No feature found in layer '${layerName}' with OBJECTID ${objectId}`);
    }

    const result = await app.queryIntersectingFeaturesByGeometry({
      $,
      mapTitle,
      boundary,
      targetLayerNames,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    const total = Object.values(result.layers || {})
      .reduce((n, l) => n + (l.count || 0), 0);
    $.export("$summary", `Found ${total} intersecting feature(s) across ${Object.keys(result.layers || {}).length} layer(s)`);

    return result;
  },
};

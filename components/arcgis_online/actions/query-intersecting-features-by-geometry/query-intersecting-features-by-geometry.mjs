import arcgisOnline from "../../arcgis_online.app.mjs";
import { ConfigurationError } from "@pipedream/types";

export default {
  key: "arcgis_online-query-intersecting-features-by-geometry",
  name: "Find Intersecting Features by Geometry",
  description:
    "Query target layers in a Feature Service for records whose geometry intersects an Esri JSON boundary you provide. Supports polygon (`rings`), polyline (`paths`), and point (`x` / `y`) geometries and returns per-layer attribute arrays. [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm)",
  version: "0.0.2",
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
    targetLayerIds: {
      propDefinition: [
        arcgisOnline,
        "targetLayerIds",
        (c) => ({
          featureService: c.featureService,
        }),
      ],
    },
    geometry: {
      type: "object",
      label: "Geometry",
      description:
        "Esri geometry JSON (`rings`, `paths`, or `x`/`y`) with `spatialReference` (`wkid` or `latestWkid`), **or** a Feature Layer `query`-style object whose `geometry` property holds that shape (other keys like `outFields` are ignored). Can be an object or a JSON string",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      featureService,
      targetLayerIds,
      geometry,
    } = this;

    if (!featureService) {
      throw new ConfigurationError("featureService is required");
    }
    if (!targetLayerIds?.length) {
      throw new ConfigurationError("targetLayerIds is required");
    }
    if (!geometry) {
      throw new ConfigurationError("geometry is required");
    }

    const result = await app.queryIntersectingFeaturesByGeometry({
      $,
      featureService,
      boundary: geometry,
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

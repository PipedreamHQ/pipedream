import arcgisOnline from "../../arcgis_online.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "arcgis_online-query-intersecting-features-by-search-query",
  name: "Find Intersecting Features by Search Query",
  description:
    "Query one source feature by SQL `WHERE` clause, then use that feature's geometry to find intersecting records in target layers from the same Feature Service. Returns per-layer attribute arrays. [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm)",
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
        "Layer id whose `query` `where` clause selects the single boundary feature",
    },
    whereClause: {
      type: "string",
      label: "WHERE Clause",
      description:
        "SQL `WHERE` fragment passed to the layer `query` API (e.g. `OBJECTID = 1` or `APN = '123-456'`). Only the **first** returned feature is used",
    },
    targetLayerIds: {
      propDefinition: [
        arcgisOnline,
        "targetLayerIds",
        (c) => ({
          featureService: c.featureService,
        }),
      ],
      description:
        "Target layer ids in the same service to intersect-query against the boundary",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      featureService,
      sourceLayerId,
      whereClause,
      targetLayerIds,
    } = this;

    if (!featureService) {
      throw new ConfigurationError("featureService is required");
    }
    if (!sourceLayerId) {
      throw new ConfigurationError("sourceLayerId is required");
    }
    if (!whereClause || whereClause === "") {
      throw new ConfigurationError("whereClause is required");
    }
    if (targetLayerIds?.length === 0) {
      throw new ConfigurationError("targetLayerIds is required");
    }

    const { boundary } = await app.fetchFirstFeatureGeometry({
      $,
      featureService,
      layerId: sourceLayerId,
      queryParams: {
        where: whereClause,
      },
    });

    if (!boundary) {
      throw new Error(
        `No feature found in layer '${sourceLayerId}' with WHERE ${whereClause}`,
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

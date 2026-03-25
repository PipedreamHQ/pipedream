import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-search-by-column",
  name: "Search by Column",
  description:
    "Run a [Feature Layer query](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm) with `where` built as `field = 'value'` (the search value is wrapped in single quotes). Returns `{ count, features }` where `features` is an array of attribute objects (no geometries). Errors if no rows match. Values containing a single quote can break the clause",
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
      description: "Layer to query",
    },
    columnName: {
      propDefinition: [
        arcgisOnline,
        "columnName",
        (c) => ({
          mapTitle: c.mapTitle,
          layerName: c.layerName,
        }),
      ],
      description:
        "Field name used on the left-hand side of `field = 'value'` (must match the service field name)",
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description:
        "Literal compared with exact string equality after single-quoting; numeric fields may still coerce depending on the service",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      mapTitle,
      layerName,
      columnName,
      searchValue,
    } = this;

    if (!mapTitle) {
      throw new Error("mapTitle is required");
    }
    if (!layerName) {
      throw new Error("layerName is required");
    }
    if (!columnName) {
      throw new Error("columnName is required");
    }
    if (searchValue === undefined || searchValue === null || searchValue === "") {
      throw new Error("searchValue is required");
    }

    const queryResult = await app.queryLayerAttributes({
      $,
      mapTitle,
      layerName,
      where: `${columnName} = '${searchValue}'`,
    });

    const features = queryResult.features ?? [];
    const attributes = features.map((f) => f.attributes);

    if (attributes.length === 0) {
      throw new Error(`No records found with ${columnName} = ${searchValue}`);
    }

    const out = {
      count: attributes.length,
      features: attributes,
    };
    $.export("$summary", `Found ${out.count} feature(s)`);
    return out;
  },
};

import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-search-by-column",
  name: "Search by Column",
  description:
    "Search for features in a layer by column and value. [See the documentation](https://developers.arcgis.com/rest/)",
  version: "0.0.5",
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
    },
    layerName: {
      propDefinition: [
        arcgisOnline,
        "layerName",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
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
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "Value to match in the specified column (matched with single-quoted equality in the WHERE clause)",
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

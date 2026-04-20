import arcgisOnline from "../../arcgis_online.app.mjs";
import { ConfigurationError } from "@pipedream/types";

export default {
  key: "arcgis_online-search-by-column",
  name: "Search by Column",
  description:
    "Search for features in a layer where a field matches a value. Builds a `WHERE field = 'value'` query with SQL-escaped single quotes. Returns matching features as a flat array of attribute objects (no geometries). [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm)",
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
    layerId: {
      propDefinition: [
        arcgisOnline,
        "layerId",
        (c) => ({
          featureService: c.featureService,
        }),
      ],
    },
    fieldName: {
      propDefinition: [
        arcgisOnline,
        "fieldName",
        (c) => ({
          featureService: c.featureService,
          layerId: c.layerId,
        }),
      ],
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description:
        "Value to match against the selected field. Compared with exact string equality; numeric fields may coerce depending on the service",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      featureService,
      layerId,
      fieldName,
      searchValue,
    } = this;

    if (!featureService) {
      throw new ConfigurationError("featureService is required");
    }
    if (!layerId) {
      throw new ConfigurationError("layerId is required");
    }
    if (!fieldName) {
      throw new ConfigurationError("fieldName is required");
    }
    if (searchValue === undefined || searchValue === null || searchValue === "") {
      throw new ConfigurationError("searchValue is required");
    }

    const escapedValue = String(searchValue).replace(/'/g, "''");
    if (!/^[A-Za-z_][A-Za-z0-9_.]*$/.test(fieldName)) {
      throw new Error(
        `Invalid fieldName "${fieldName}": use a letter or underscore first, then letters, digits, underscores, or dots only`,
      );
    }
    const queryResult = await app.queryLayerAttributesAllPages({
      $,
      featureService,
      layerId,
      where: `${fieldName} = '${escapedValue}'`,
    });

    const features = queryResult.features ?? [];
    const attributes = features.map((f) => f.attributes);

    $.export(
      "$summary",
      `Found ${attributes.length} feature(s) where ${fieldName} = '${searchValue}'`,
    );
    return attributes;
  },
};

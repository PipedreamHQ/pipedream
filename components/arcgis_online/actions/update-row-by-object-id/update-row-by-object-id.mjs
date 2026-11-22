import arcgisOnline from "../../arcgis_online.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

// Values for these field types are sent verbatim: JSON-parsing them would turn "1.50"
// into 1.5 and drop digits from long numeric IDs before ArcGIS coerces them back to text.
const TEXT_FIELD_TYPES = [
  "esriFieldTypeString",
  "esriFieldTypeGUID",
  "esriFieldTypeGlobalID",
  "esriFieldTypeXML",
];

export default {
  key: "arcgis_online-update-row-by-object-id",
  name: "Update Row by Object ID",
  description:
    "Update a single attribute on a feature identified by OBJECTID using the applyEdits operation. Dropdowns filter to editable layers and fields. [See the documentation](https://developers.arcgis.com/rest/services-reference/enterprise/apply-edits-feature-service-layer-.htm)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
          editableOnly: true,
        }),
      ],
      description:
        "Editable layer (service metadata must list Update or Editing capability)",
    },
    objectId: {
      propDefinition: [
        arcgisOnline,
        "objectId",
        (c) => ({
          featureService: c.featureService,
          layerId: c.layerId,
          editableOnly: true,
        }),
      ],
      description: "OBJECTID of the feature to update",
    },
    fieldName: {
      propDefinition: [
        arcgisOnline,
        "fieldName",
        (c) => ({
          featureService: c.featureService,
          layerId: c.layerId,
          editableOnly: true,
        }),
      ],
      description:
        "Editable field to update (system fields like OBJECTID and GlobalID are excluded)",
    },
    newValue: {
      type: "string",
      label: "New Value",
      description:
        "New value for the attribute. Use `null` to clear a nullable field. Text fields receive " +
        "the value exactly as entered; for other field types, JSON text is sent as the parsed " +
        "value, so `42` and `true` become a number and a boolean. ArcGIS coerces values to the " +
        "field type.",
    },
  },
  methods: {
    parseValue(value, fieldType) {
      if (typeof value !== "string") {
        return value;
      }
      if (value.trim() === "null") {
        return null;
      }
      if (TEXT_FIELD_TYPES.includes(fieldType)) {
        return value;
      }
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      featureService,
      layerId,
      objectId,
      fieldName,
      newValue,
    } = this;

    if (!featureService) {
      throw new ConfigurationError("featureService is required");
    }
    if (layerId == null || layerId === "") {
      throw new ConfigurationError("layerId is required");
    }
    if (objectId == null || String(objectId).trim() === "") {
      throw new ConfigurationError("objectId is required");
    }
    if (!fieldName) {
      throw new ConfigurationError("fieldName is required");
    }
    if (newValue === undefined) {
      throw new ConfigurationError("newValue is required");
    }

    const objectIdStr = String(objectId).trim();
    if (!/^\d+$/.test(objectIdStr)) {
      throw new Error(
        `objectId must be a whole non-negative integer; got "${objectId}"`,
      );
    }
    const objectIdNum = parseInt(objectIdStr, 10);

    const ctx = await app.resolveLayerContext({
      $,
      featureService,
      layerId,
    });
    app.assertLayerSupportsUpdates(ctx.meta, ctx.layerDisplayName);

    if (fieldName.toLowerCase() === ctx.objectIdField.toLowerCase()) {
      throw new Error(
        `fieldName must not be the object id field (${ctx.objectIdField})`,
      );
    }
    const fieldMeta = (ctx.meta.fields ?? []).find(
      (f) => f.name != null
        && f.name.toLowerCase() === fieldName.toLowerCase(),
    );
    if (fieldMeta && !app._fieldIsUpdatable(fieldMeta, ctx.meta)) {
      throw new Error(
        `Field "${fieldName}" is not editable on this layer. Pick a field from the dropdown or correct the name.`,
      );
    }

    const updateResult = await app.postApplyEdits({
      $,
      baseUrl: ctx.baseUrl,
      servicePath: ctx.servicePath,
      layerId: ctx.layerId,
      attributes: {
        [ctx.objectIdField]: objectIdNum,
        [fieldName]: this.parseValue(newValue, fieldMeta?.type),
      },
    });

    const first = updateResult?.updateResults?.[0];
    if (!first?.success) {
      const errDetail = first?.error
        ? JSON.stringify(first.error)
        : JSON.stringify(updateResult);
      throw new Error(`applyEdits failed: ${errDetail}`);
    }

    $.export(
      "$summary",
      `Updated ${ctx.layerDisplayName} OBJECTID ${objectId}: set ${fieldName} to "${newValue}"`,
    );

    return {
      objectId,
      layerId,
      fieldName,
      newValue,
      updateResult,
    };
  },
};

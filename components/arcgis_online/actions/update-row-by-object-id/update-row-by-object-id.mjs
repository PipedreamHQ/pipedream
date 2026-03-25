import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-update-row-by-object-id",
  name: "Update Row by Object ID",
  description:
    "Send `applyEdits` with the layer's real object id field (from service metadata, not always `OBJECTID`) plus one other field. You cannot set `columnName` to the OID field. Throws if the service reports `updateResults[0].success` false. See [Apply Edits (Feature Service Layer)](https://developers.arcgis.com/rest/services-reference/enterprise/apply-edits-feature-service-layer-.htm)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
      description: "Layer that contains the row to update (must be editable)",
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
        "Feature to update; the layer's object id field is set from this value (dropdown is paged; you may type an ID)",
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
        "Attribute field to change (must be editable; value is sent as a string in the update attributes object)",
    },
    newValue: {
      type: "string",
      label: "New Value",
      description:
        "New attribute value as text (ArcGIS coerces to the field type where applicable)",
    },
  },
  async run({ $ }) {
    const {
      arcgisOnline: app,
      mapTitle,
      layerName,
      objectId,
      columnName,
      newValue,
    } = this;

    if (!mapTitle || !layerName || !objectId || !columnName || newValue === undefined) {
      throw new Error("All fields are required");
    }

    const ctx = await app.resolveLayerContext({
      $,
      mapTitle,
      layerName,
    });
    if (columnName.toLowerCase() === ctx.objectIdField.toLowerCase()) {
      throw new Error(
        `columnName must not be the layer object id field (${ctx.objectIdField})`,
      );
    }

    const updateResult = await app.postApplyEdits({
      $,
      baseUrl: ctx.baseUrl,
      servicePath: ctx.servicePath,
      layerId: ctx.layerId,
      attributes: {
        [ctx.objectIdField]: parseInt(objectId, 10),
        [columnName]: newValue,
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
      `Updated ${layerName} ${ctx.objectIdField} ${objectId} (${columnName})`,
    );

    return {
      objectId,
      layerName,
      columnName,
      newValue,
      updateResult,
    };
  },
};

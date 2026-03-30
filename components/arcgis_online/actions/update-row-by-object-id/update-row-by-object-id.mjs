import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-update-row-by-object-id",
  name: "Update Row by Object ID",
  description:
    "Send `applyEdits` with the layer's object id field plus one other attribute. Dropdowns list only layers and fields that service metadata marks as editable (read-only views and system fields are hidden). You may still type ids or field names manually; `applyEdits` enforces portal permissions. See [Apply Edits (Feature Service Layer)](https://developers.arcgis.com/rest/services-reference/enterprise/apply-edits-feature-service-layer-.htm)",
  version: "0.1.3",
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
        "layerNameEditable",
        (c) => ({
          mapTitle: c.mapTitle,
        }),
      ],
      description:
        "Editable layer id only (metadata must list Update/Editing on capabilities)",
    },
    objectId: {
      propDefinition: [
        arcgisOnline,
        "objectIdEditable",
        (c) => ({
          mapTitle: c.mapTitle,
          layerName: c.layerName,
        }),
      ],
      description:
        "Row to update (paged ids; layer must allow editing in metadata; you may type an id)",
    },
    columnName: {
      propDefinition: [
        arcgisOnline,
        "columnNameEditable",
        (c) => ({
          mapTitle: c.mapTitle,
          layerName: c.layerName,
        }),
      ],
      description:
        "User-editable field from layer metadata (`editable: true`); sent as text in attributes",
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

    const objectIdStr = String(objectId).trim();
    if (!/^\d+$/.test(objectIdStr)) {
      throw new Error(
        `objectId must be a whole non-negative integer (digits only); got "${objectId}"`,
      );
    }
    const objectIdNum = parseInt(objectIdStr, 10);

    const ctx = await app.resolveLayerContext({
      $,
      mapTitle,
      layerName,
    });
    app.assertLayerSupportsUpdates(ctx.meta, ctx.layerDisplayName);
    if (columnName.toLowerCase() === ctx.objectIdField.toLowerCase()) {
      throw new Error(
        `columnName must not be the layer object id field (${ctx.objectIdField})`,
      );
    }
    const fieldMeta = (ctx.meta.fields ?? []).find(
      (f) => f.name != null && f.name.toLowerCase() === columnName.toLowerCase(),
    );
    if (fieldMeta && !app._fieldIsUpdatable(fieldMeta, ctx.meta)) {
      throw new Error(
        `Field "${columnName}" is not editable on this layer (metadata). Pick a field from the dropdown or correct the name.`,
      );
    }

    const updateResult = await app.postApplyEdits({
      $,
      baseUrl: ctx.baseUrl,
      servicePath: ctx.servicePath,
      layerId: ctx.layerId,
      attributes: {
        [ctx.objectIdField]: objectIdNum,
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
      `Updated ${ctx.layerDisplayName} ${ctx.objectIdField} ${objectId} (${columnName})`,
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

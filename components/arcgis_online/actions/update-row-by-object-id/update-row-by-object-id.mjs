import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-update-row-by-object-id",
  name: "Update Row by Object ID",
  description:
    "Send an `applyEdits` `updates` payload to one layer: set `OBJECTID` and one additional field to `newValue` (string in the props; sent as the attribute value). The feature service must allow editing. Returns `objectId`, `layerName`, `columnName`, `newValue`, and the raw `updateResult` from the API. See [Apply Edits (Feature Service Layer)](https://developers.arcgis.com/rest/services-reference/enterprise/apply-edits-feature-service-layer-.htm)",
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
        "Feature to update; `OBJECTID` in the edit payload is set from this value (dropdown is paged; you may type an ID)",
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

    const updateResult = await app.applyFeatureUpdates({
      $,
      mapTitle,
      layerName,
      attributes: {
        OBJECTID: parseInt(objectId, 10),
        [columnName]: newValue,
      },
    });

    $.export("$summary", `Updated ${layerName} OBJECTID ${objectId} (${columnName})`);

    return {
      objectId,
      layerName,
      columnName,
      newValue,
      updateResult,
    };
  },
};

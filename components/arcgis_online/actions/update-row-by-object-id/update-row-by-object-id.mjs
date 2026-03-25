import arcgisOnline from "../../arcgis_online.app.mjs";

export default {
  key: "arcgis_online-update-row-by-object-id",
  name: "Update Row by Object ID",
  description:
    "Update an attribute value for a feature identified by OBJECTID. [See the documentation](https://developers.arcgis.com/rest/)",
  version: "0.0.3",
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
    objectId: {
      type: "string",
      label: "Object ID",
      description: "OBJECTID of the feature to update",
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
    newValue: {
      type: "string",
      label: "New Value",
      description: "New value for the column",
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

import app from "../../snipe_it.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "snipe_it-create-hardware",
  name: "Create Hardware Asset",
  description: "Creates a new hardware asset in Snipe-IT. [See the documentation](https://snipe-it.readme.io/reference/hardware-create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    modelId: {
      propDefinition: [
        app,
        "modelId",
      ],
    },
    statusId: {
      propDefinition: [
        app,
        "statusId",
      ],
    },
    assetTag: {
      propDefinition: [
        app,
        "assetTag",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    image: {
      propDefinition: [
        app,
        "image",
      ],
    },
    serial: {
      propDefinition: [
        app,
        "serial",
      ],
    },
    purchaseDate: {
      propDefinition: [
        app,
        "purchaseDate",
      ],
    },
    purchaseCost: {
      propDefinition: [
        app,
        "purchaseCost",
      ],
    },
    orderNumber: {
      propDefinition: [
        app,
        "orderNumber",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
    archived: {
      propDefinition: [
        app,
        "archived",
      ],
    },
    warrantyMonths: {
      propDefinition: [
        app,
        "warrantyMonths",
      ],
    },
    depreciate: {
      propDefinition: [
        app,
        "depreciate",
      ],
    },
    supplierId: {
      propDefinition: [
        app,
        "supplierId",
      ],
    },
    requestable: {
      propDefinition: [
        app,
        "requestable",
      ],
    },
    rtdLocationId: {
      label: "RTD Location",
      description: "Select the default location for this asset",
      propDefinition: [
        app,
        "locationId",
      ],
    },
    lastAuditDate: {
      propDefinition: [
        app,
        "lastAuditDate",
      ],
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    byod: {
      propDefinition: [
        app,
        "byod",
      ],
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      modelId,
      statusId,
      assetTag,
      name,
      image,
      serial,
      purchaseDate,
      purchaseCost,
      orderNumber,
      notes,
      archived,
      warrantyMonths,
      depreciate,
      supplierId,
      requestable,
      rtdLocationId,
      lastAuditDate,
      locationId,
      byod,
      customFields,
    } = this;

    const parsedCustomFields = utils.parseJson(customFields);

    const response = await app.createHardware({
      $,
      data: {
        model_id: modelId,
        status_id: statusId,
        ...(name && {
          name,
        }),
        ...(assetTag && {
          asset_tag: assetTag,
        }),
        ...(image && {
          image,
        }),
        ...(serial && {
          serial,
        }),
        ...(purchaseDate && {
          purchase_date: purchaseDate,
        }),
        ...(purchaseCost && {
          purchase_cost: purchaseCost,
        }),
        ...(orderNumber && {
          order_number: orderNumber,
        }),
        ...(notes && {
          notes,
        }),
        ...(archived !== undefined && {
          archived,
        }),
        ...(warrantyMonths && {
          warranty_months: warrantyMonths,
        }),
        ...(depreciate !== undefined && {
          depreciate,
        }),
        ...(supplierId && {
          supplier_id: supplierId,
        }),
        ...(requestable !== undefined && {
          requestable,
        }),
        ...(rtdLocationId && {
          rtd_location_id: rtdLocationId,
        }),
        ...(lastAuditDate && {
          last_audit_date: lastAuditDate,
        }),
        ...(locationId && {
          location_id: locationId,
        }),
        ...(byod !== undefined && {
          byod,
        }),
        ...(typeof(parsedCustomFields) === "object"
          ? parsedCustomFields
          : {}
        ),
      },
    });

    $.export("$summary", `Successfully created hardware asset with ID \`${response.payload.id}\``);
    return response;
  },
};

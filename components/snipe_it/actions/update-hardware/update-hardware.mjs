import app from "../../snipe_it.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "snipe_it-update-hardware",
  name: "Update Hardware Asset",
  description: "Partially updates information about an existing hardware asset. [See the documentation](https://snipe-it.readme.io/reference/hardware-partial-update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    hardwareId: {
      propDefinition: [
        app,
        "hardwareId",
      ],
      description: "Select the hardware asset to update",
    },
    assetTag: {
      propDefinition: [
        app,
        "assetTag",
      ],
      description: "Update the asset tag",
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
      description: "Update notes about the asset",
    },
    statusId: {
      optional: true,
      propDefinition: [
        app,
        "statusId",
      ],
      description: "Update the status of the asset",
    },
    modelId: {
      optional: true,
      propDefinition: [
        app,
        "modelId",
      ],
      description: "Update the model of the asset",
    },
    lastCheckout: {
      propDefinition: [
        app,
        "lastCheckout",
      ],
      description: "Update the last checkout date",
    },
    assignedUser: {
      optional: true,
      propDefinition: [
        app,
        "userId",
      ],
      label: "Assigned User",
      description: "The ID of the user the asset should be checked out to",
    },
    assignedLocation: {
      optional: true,
      propDefinition: [
        app,
        "userId",
      ],
      label: "Assigned Location",
      description: "The ID of the user the location should be checked out to",
    },
    assignedAsset: {
      optional: true,
      propDefinition: [
        app,
        "hardwareId",
      ],
      label: "Assigned Asset",
      description: "The ID of the asset the asset should be checked out to",
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      description: "The ID of an associated company id",
    },
    serial: {
      propDefinition: [
        app,
        "serial",
      ],
      description: "Serial number of the asset",
    },
    orderNumber: {
      propDefinition: [
        app,
        "orderNumber",
      ],
      description: "Update the order number",
    },
    warrantyMonths: {
      propDefinition: [
        app,
        "warrantyMonths",
      ],
      description: "Update the warranty period",
    },
    purchaseCost: {
      propDefinition: [
        app,
        "purchaseCost",
      ],
      description: "Update the purchase cost",
    },
    purchaseDate: {
      propDefinition: [
        app,
        "purchaseDate",
      ],
      description: "Update the purchase date",
    },
    requestable: {
      propDefinition: [
        app,
        "requestable",
      ],
      description: "Update whether the asset can be requested",
    },
    archived: {
      propDefinition: [
        app,
        "archived",
      ],
      description: "Update the archived status",
    },
    rtdLocationId: {
      propDefinition: [
        app,
        "locationId",
      ],
      description: "Update the RTD location",
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Update the name of the asset",
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
      description: "Update the location of the asset",
    },
    byod: {
      propDefinition: [
        app,
        "byod",
      ],
      description: "Update the BYOD",
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
      description: "Update custom fields using DB field names from Settings > Custom Fields",
    },
  },
  async run({ $ }) {
    const {
      app,
      hardwareId,
      assetTag,
      notes,
      statusId,
      modelId,
      lastCheckout,
      assignedUser,
      assignedLocation,
      assignedAsset,
      companyId,
      serial,
      orderNumber,
      warrantyMonths,
      purchaseCost,
      purchaseDate,
      requestable,
      archived,
      rtdLocationId,
      name,
      locationId,
      byod,
      customFields,
    } = this;

    const parsedCustomFields = utils.parseJson(customFields);

    const data = {
      ...(assetTag && {
        asset_tag: assetTag,
      }),
      ...(notes && {
        notes,
      }),
      ...(statusId && {
        status_id: statusId,
      }),
      ...(modelId && {
        model_id: modelId,
      }),
      ...(lastCheckout && {
        last_checkout: lastCheckout,
      }),
      ...(assignedUser && {
        assigned_user_id: assignedUser,
      }),
      ...(assignedLocation && {
        assigned_location_id: assignedLocation,
      }),
      ...(assignedAsset && {
        assigned_asset_id: assignedAsset,
      }),
      ...(companyId && {
        company_id: companyId,
      }),
      ...(serial && {
        serial,
      }),
      ...(orderNumber && {
        order_number: orderNumber,
      }),
      ...(warrantyMonths && {
        warranty_months: warrantyMonths,
      }),
      ...(purchaseCost && {
        purchase_cost: purchaseCost,
      }),
      ...(purchaseDate && {
        purchase_date: purchaseDate,
      }),
      ...(requestable && {
        requestable,
      }),
      ...(archived && {
        archived,
      }),
      ...(rtdLocationId && {
        rtd_location_id: rtdLocationId,
      }),
      ...(name && {
        name,
      }),
      ...(locationId && {
        location_id: locationId,
      }),
      ...(byod && {
        byod,
      }),
      ...(typeof(parsedCustomFields) === "object"
        ? parsedCustomFields
        : {}
      ),
    };

    if (Object.keys(data).length === 0) {
      throw new Error("At least one field must be provided to update");
    }

    const response = await app.updateHardware({
      $,
      hardwareId,
      data,
    });

    $.export("$summary", `Successfully updated hardware asset with ID \`${response.payload.id}\``);
    return response;
  },
};

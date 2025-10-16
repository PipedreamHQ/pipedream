import app from "../../paazl.app.mjs";

export default {
  key: "paazl-create-shipment",
  name: "Create Shipment For Order",
  description: "Generates a shipment at the carrier for the shipping option specified in POST order. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/createShipmentUsingPOST)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderReference: {
      propDefinition: [
        app,
        "reference",
      ],
    },
    type: {
      optional: false,
      propDefinition: [
        app,
        "labelType",
      ],
    },
    size: {
      optional: false,
      propDefinition: [
        app,
        "labelSize",
      ],
    },
    quantity: {
      propDefinition: [
        app,
        "quantity",
      ],
    },
    enableParcels: {
      propDefinition: [
        app,
        "enableParcels",
      ],
    },
    parcelWeight: {
      propDefinition: [
        app,
        "parcelWeight",
      ],
    },
    parcelLength: {
      propDefinition: [
        app,
        "parcelLength",
      ],
    },
    parcelWidth: {
      propDefinition: [
        app,
        "parcelWidth",
      ],
    },
    parcelHeight: {
      propDefinition: [
        app,
        "parcelHeight",
      ],
    },
    parcelVolume: {
      propDefinition: [
        app,
        "parcelVolume",
      ],
    },
    parcelReference: {
      propDefinition: [
        app,
        "parcelReference",
      ],
    },
    parcelDescription: {
      propDefinition: [
        app,
        "parcelDescription",
      ],
    },
    parcelCodValue: {
      propDefinition: [
        app,
        "parcelCodValue",
      ],
    },
    parcelCodCurrency: {
      propDefinition: [
        app,
        "parcelCodCurrency",
      ],
    },
    parcelInsuredValue: {
      propDefinition: [
        app,
        "parcelInsuredValue",
      ],
    },
    parcelInsuredCurrency: {
      propDefinition: [
        app,
        "parcelInsuredCurrency",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      orderReference,
      type,
      size,
      quantity,
      enableParcels,
      parcelWeight,
      parcelLength,
      parcelWidth,
      parcelHeight,
      parcelVolume,
      parcelReference,
      parcelDescription,
      parcelCodValue,
      parcelCodCurrency,
      parcelInsuredValue,
      parcelInsuredCurrency,
    } = this;

    const response = await app.createShipment({
      $,
      orderReference,
      data: {
        type,
        size,
        quantity,
        ...(enableParcels && parcelWeight
          ? {
            parcels: [
              {
                weight: parseFloat(parcelWeight),
                ...(parcelLength && parcelWidth && parcelHeight
                  ? {
                    dimensions: {
                      length: parcelLength,
                      width: parcelWidth,
                      height: parcelHeight,
                      ...(parcelVolume
                        ? {
                          volume: parseFloat(parcelVolume),
                        }
                        : {}
                      ),
                    },
                  }
                  : parcelVolume
                    ? {
                      dimensions: {
                        volume: parseFloat(parcelVolume),
                      },
                    }
                    : {}
                ),
                reference: parcelReference,
                description: parcelDescription,
                ...(parcelCodValue
                  ? {
                    codValue: {
                      value: parseFloat(parcelCodValue),
                      currency: parcelCodCurrency || "EUR",
                    },
                  }
                  : {}
                ),
                ...(parcelInsuredValue
                  ? {
                    insuredValue: {
                      value: parseFloat(parcelInsuredValue),
                      currency: parcelInsuredCurrency || "EUR",
                    },
                  }
                  : {}
                ),
              },
            ],
          }
          : {}
        ),
      },
    });

    $.export("$summary", `Successfully created shipment for order: ${orderReference}`);
    return response;
  },
};

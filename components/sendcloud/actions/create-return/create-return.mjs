import app from "../../sendcloud.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sendcloud-create-return",
  name: "Create Return",
  description: "Create a return. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/returns/operations/create-a-return)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fromAddress: {
      label: "From Address",
      propDefinition: [
        app,
        "addressSetup",
      ],
    },
    toAddress: {
      label: "To Address",
      propDefinition: [
        app,
        "addressSetup",
      ],
    },
    shipWith: {
      propDefinition: [
        app,
        "shipWith",
      ],
    },
    dimensionsLength: {
      propDefinition: [
        app,
        "dimensionsLength",
      ],
    },
    dimensionsWidth: {
      propDefinition: [
        app,
        "dimensionsWidth",
      ],
    },
    dimensionsHeight: {
      propDefinition: [
        app,
        "dimensionsHeight",
      ],
    },
    dimensionsUnit: {
      propDefinition: [
        app,
        "dimensionsUnit",
      ],
    },
    weightValue: {
      propDefinition: [
        app,
        "weightValue",
      ],
    },
    weightUnit: {
      propDefinition: [
        app,
        "weightUnit",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      fromAddress,
      toAddress,
      shipWith,
      dimensionsLength,
      dimensionsWidth,
      dimensionsHeight,
      dimensionsUnit,
      weightValue,
      weightUnit,
    } = this;

    const response = await app.createReturn({
      $,
      data: {
        from_address: utils.parseJson(fromAddress),
        to_address: utils.parseJson(toAddress),
        ship_with: utils.parseJson(shipWith),
        ...(dimensionsLength
          && dimensionsWidth
          && dimensionsHeight
          && dimensionsUnit
          ? {
            dimensions: {
              length: dimensionsLength,
              width: dimensionsWidth,
              height: dimensionsHeight,
              unit: dimensionsUnit,
            },
          }
          : undefined
        ),
        ...(weightValue && weightUnit
          ? {
            weight: {
              value: weightValue,
              unit: weightUnit,
            },
          }
          : undefined
        ),
      },
    });

    $.export("$summary", "Successfully created return");

    return response;
  },
};


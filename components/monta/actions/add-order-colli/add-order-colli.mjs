import monta from "../../monta.app.mjs";

export default {
  key: "monta-add-order-colli",
  name: "Add Order Colli",
  description: "Register a collo (parcel) on an order, including its dimensions and tracking details. Use this to record how an order was packed; inspect the result with **List Order Colli**. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1colli/post)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
    number: {
      type: "integer",
      label: "Number",
      description: "The collo number within the order (e.g. `1` for the first parcel)",
    },
    weightGrammes: {
      type: "integer",
      label: "Weight (grammes)",
      description: "The weight of the collo in grammes (e.g. `1234` for 1.234 kg)",
      optional: true,
    },
    lengthMm: {
      type: "integer",
      label: "Length (mm)",
      description: "The length of the collo in millimetres",
      optional: true,
    },
    widthMm: {
      type: "integer",
      label: "Width (mm)",
      description: "The width of the collo in millimetres",
      optional: true,
    },
    heightMm: {
      type: "integer",
      label: "Height (mm)",
      description: "The height of the collo in millimetres",
      optional: true,
    },
    trackAndTraceCode: {
      type: "string",
      label: "Track and Trace Code",
      description: "The track and trace code for the collo",
      optional: true,
    },
    trackAndTraceLink: {
      type: "string",
      label: "Track and Trace Link",
      description: "The track and trace link for the collo (e.g. `https://carrier.example/track/ABC123`)",
      optional: true,
    },
    packageDescription: {
      type: "string",
      label: "Package Description",
      description: "A description of the package",
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        monta,
        "additionalFields",
      ],
      description: "Additional collo properties to send in the request body, using Monta's request-body casing (e.g. `{ \"IsParent\": true }`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.monta.createOrderColli({
      $,
      orderId: this.orderId,
      data: {
        ...this.additionalFields,
        Number: this.number,
        WeightGrammes: this.weightGrammes,
        LengthMm: this.lengthMm,
        WidthMm: this.widthMm,
        HeightMm: this.heightMm,
        TrackAndTraceCode: this.trackAndTraceCode,
        TrackAndTraceLink: this.trackAndTraceLink,
        PackageDescription: this.packageDescription,
      },
    });

    $.export("$summary", `Successfully added collo \`${this.number}\` to order \`${this.orderId}\``);

    return response;
  },
};

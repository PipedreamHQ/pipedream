import starshipit from "../../starshipit.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "starshipit-print-label",
  name: "Print Shipping Label",
  description: "Print a shipping label for a specific order. [See the documentation](https://api-docs.starshipit.com/#b6bc3576-a43f-4992-86d8-8fdf57f872f6)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    starshipit,
    orderNumber: {
      propDefinition: [
        starshipit,
        "orderNumber",
      ],
    },
    carrier: {
      type: "string",
      label: "Carrier",
      description: "The carrier that will be used when creating shipment",
    },
    carrierServiceCode: {
      type: "string",
      label: "Carrier Service Code",
      description: "Carrier service code for delivery",
    },
    numPackages: {
      type: "integer",
      label: "Number of Packages",
      description: "The number of packages in the order",
      reloadProps: true,
    },
    reprint: {
      type: "boolean",
      label: "Reprint",
      description: "  Returns labels previously generated for the printed order",
      default: false,
      optional: true,
    },
  },
  additionalProps() {
    const props = {};
    for (let i = 1; i <= this.numPackages; i++) {
      props[`package_${i}_weight`] = {
        type: "string",
        label: `Package ${i} Weight`,
        description: "Physical weight of the parcel in kilograms (kg)",
        optional: true,
      };
      props[`package_${i}_height`] = {
        type: "string",
        label: `Package ${i} Height`,
        description: "Height of the parcel in meters (m)",
        optional: true,
      };
      props[`package_${i}_width`] = {
        type: "string",
        label: `Package ${i} Width`,
        description: "Width of the parcel in meters (m)",
        optional: true,
      };
      props[`package_${i}_length`] = {
        type: "string",
        label: `Package ${i} Length`,
        description: "Length of the parcel in meters (m)",
        optional: true,
      };
    }
    return props;
  },
  methods: {
    parseFloat(i, type) {
      return utils.parseFloatProp(this, "package", i, type);
    },
  },
  async run({ $ }) {
    const packages = [];
    for (let i = 1; i <= this.numPackages; i++) {
      packages.push({
        weight: this.parseFloat(i, "weight"),
        height: this.parseFloat(i, "height"),
        width: this.parseFloat(i, "width"),
        length: this.parseFloat(i, "length"),
      });
    }

    const response = await this.starshipit.printShippingLabel({
      data: {
        order_number: this.orderNumber,
        carrier: this.carrier,
        carrier_service_code: this.carrierServiceCode,
        reprint: this.repring,
        packages,
      },
      $,
    });
    if (response?.success === false) {
      throw new Error(`${response.errors[0].message}: ${response.errors[0].details}`);
    }
    if (response) {
      $.export("$summary", `Successfully printed shipping label for order number ${this.orderNumber}`);
    }
    return response;
  },
};

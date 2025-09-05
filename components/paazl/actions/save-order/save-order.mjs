import app from "../../paazl.app.mjs";

export default {
  key: "paazl-save-order",
  name: "Save Order",
  description: "Saves an order's most important information to the Paazl database once a customer has paid for their purchase. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Order/saveOrderUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reference: {
      propDefinition: [
        app,
        "reference",
      ],
      label: "Order Reference",
      description: "Your own order reference for a purchase transaction. Must be unique within the webshop.",
    },
    consigneeName: {
      propDefinition: [
        app,
        "consigneeName",
      ],
    },
    consigneeEmail: {
      propDefinition: [
        app,
        "consigneeEmail",
      ],
    },
    consigneePhone: {
      propDefinition: [
        app,
        "consigneePhone",
      ],
    },
    consigneeCompanyName: {
      propDefinition: [
        app,
        "consigneeCompanyName",
      ],
    },
    consigneeLocale: {
      propDefinition: [
        app,
        "consigneeLocale",
      ],
    },
    addressCity: {
      propDefinition: [
        app,
        "addressCity",
      ],
    },
    addressCountry: {
      propDefinition: [
        app,
        "addressCountry",
      ],
    },
    addressPostalCode: {
      propDefinition: [
        app,
        "addressPostalCode",
      ],
    },
    addressStreet: {
      propDefinition: [
        app,
        "addressStreet",
      ],
    },
    addressHouseNumber: {
      propDefinition: [
        app,
        "addressHouseNumber",
      ],
    },
    addressHouseNumberExtension: {
      propDefinition: [
        app,
        "addressHouseNumberExtension",
      ],
    },
    addressProvince: {
      propDefinition: [
        app,
        "addressProvince",
      ],
    },
    addressStreetLines: {
      propDefinition: [
        app,
        "addressStreetLines",
      ],
    },
    shippingOption: {
      propDefinition: [
        app,
        "shippingOption",
      ],
    },
    shippingContract: {
      propDefinition: [
        app,
        "shippingContract",
      ],
    },
    shippingReturnContract: {
      propDefinition: [
        app,
        "shippingReturnContract",
      ],
    },
    shippingPackageCount: {
      propDefinition: [
        app,
        "shippingPackageCount",
      ],
    },
    shippingMultiPackageShipment: {
      propDefinition: [
        app,
        "shippingMultiPackageShipment",
      ],
    },
    pickupLocationCode: {
      propDefinition: [
        app,
        "pickupLocationCode",
      ],
    },
    pickupLocationAccountNumber: {
      propDefinition: [
        app,
        "pickupLocationAccountNumber",
      ],
    },
    description: {
      propDefinition: [
        app,
        "orderDescription",
      ],
    },
    weight: {
      propDefinition: [
        app,
        "orderWeight",
      ],
    },
    requestedDeliveryDate: {
      propDefinition: [
        app,
        "requestedDeliveryDate",
      ],
    },
    additionalInstruction: {
      propDefinition: [
        app,
        "additionalInstruction",
      ],
    },
    invoiceNumber: {
      propDefinition: [
        app,
        "invoiceNumber",
      ],
    },
    invoiceDate: {
      propDefinition: [
        app,
        "invoiceDate",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      reference,
      consigneeName,
      consigneeEmail,
      consigneePhone,
      consigneeCompanyName,
      consigneeLocale,
      addressCity,
      addressCountry,
      addressPostalCode,
      addressStreet,
      addressHouseNumber,
      addressHouseNumberExtension,
      addressProvince,
      addressStreetLines,
      shippingOption,
      shippingContract,
      shippingReturnContract,
      shippingPackageCount,
      shippingMultiPackageShipment,
      pickupLocationCode,
      pickupLocationAccountNumber,
      description,
      weight,
      requestedDeliveryDate,
      additionalInstruction,
      invoiceNumber,
      invoiceDate,
    } = this;

    const response = await app.saveOrder({
      $,
      data: {
        reference,
        consignee: {
          name: consigneeName,
          email: consigneeEmail,
          phone: consigneePhone,
          companyName: consigneeCompanyName,
          locale: consigneeLocale,
          address: {
            city: addressCity,
            country: addressCountry,
            postalCode: addressPostalCode,
            street: addressStreet,
            houseNumber: addressHouseNumber,
            houseNumberExtension: addressHouseNumberExtension,
            province: addressProvince,
            streetLines: addressStreetLines,
          },
        },
        shipping: {
          option: shippingOption,
          contract: shippingContract,
          returnContract: shippingReturnContract,
          packageCount: shippingPackageCount,
          multiPackageShipment: shippingMultiPackageShipment,
          ...(pickupLocationCode
            ? {
              pickupLocation: {
                code: pickupLocationCode,
                accountNumber: pickupLocationAccountNumber,
              },
            }
            : {}
          ),
        },
        description,
        weight: weight
          ? parseFloat(weight)
          : undefined,
        requestedDeliveryDate,
        additionalInstruction,
        invoiceNumber,
        invoiceDate,
      },
    });

    $.export("$summary", `Successfully saved order information for reference: ${reference}`);
    return response;
  },
};

import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-update-order",
  name: "Update Picqer Order",
  description: "Update an order in Picqer. [See the documentation](https://picqer.com/en/api/orders#update)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    picqer,
    orderId: {
      propDefinition: [
        picqer,
        "orderId",
      ],
    },
    customerId: {
      propDefinition: [
        picqer,
        "customerId",
      ],
      reloadProps: true,
      optional: true,
    },
    templateId: {
      propDefinition: [
        picqer,
        "templateId",
      ],
      optional: true,
    },
    deliveryName: {
      propDefinition: [
        picqer,
        "deliveryName",
      ],
      description: "Name of delivery address.",
      optional: true,
      hidden: true,
    },
    deliveryContactName: {
      propDefinition: [
        picqer,
        "deliveryContactName",
      ],
      optional: true,
      hidden: true,
    },
    deliveryAddress: {
      propDefinition: [
        picqer,
        "deliveryAddress",
      ],
      optional: true,
      hidden: true,
    },
    deliveryAddress2: {
      propDefinition: [
        picqer,
        "deliveryAddress2",
      ],
      optional: true,
      hidden: true,
    },
    deliveryZipcode: {
      propDefinition: [
        picqer,
        "deliveryZipcode",
      ],
      optional: true,
      hidden: true,
    },
    deliveryCity: {
      propDefinition: [
        picqer,
        "deliveryCity",
      ],
      optional: true,
      hidden: true,
    },
    deliveryRegion: {
      propDefinition: [
        picqer,
        "deliveryRegion",
      ],
      optional: true,
      hidden: true,
    },
    deliveryCountry: {
      propDefinition: [
        picqer,
        "deliveryCountry",
      ],
      description: "Country of delivery address (needs to be ISO 3166 2-char code).",
      optional: true,
      hidden: true,
    },
    invoiceName: {
      propDefinition: [
        picqer,
        "invoiceName",
      ],
      description: "Name of invoice address.",
      optional: true,
      hidden: true,
    },
    invoiceContactName: {
      propDefinition: [
        picqer,
        "invoiceContactName",
      ],
      optional: true,
      hidden: true,
    },
    invoiceAddress: {
      propDefinition: [
        picqer,
        "invoiceAddress",
      ],
      optional: true,
      hidden: true,
    },
    invoiceAddress2: {
      propDefinition: [
        picqer,
        "invoiceAddress2",
      ],
      optional: true,
      hidden: true,
    },
    invoiceZipcode: {
      propDefinition: [
        picqer,
        "invoiceZipcode",
      ],
      optional: true,
      hidden: true,
    },
    invoiceCity: {
      propDefinition: [
        picqer,
        "invoiceCity",
      ],
      optional: true,
      hidden: true,
    },
    invoiceRegion: {
      propDefinition: [
        picqer,
        "invoiceRegion",
      ],
      optional: true,
      hidden: true,
    },
    invoiceCountry: {
      propDefinition: [
        picqer,
        "invoiceCountry",
      ],
      optional: true,
      hidden: true,
    },
    telephone: {
      propDefinition: [
        picqer,
        "telephone",
      ],
      optional: true,
    },
    emailAddress: {
      propDefinition: [
        picqer,
        "emailAddress",
      ],
      optional: true,
    },
    discount: {
      propDefinition: [
        picqer,
        "discount",
      ],
      optional: true,
    },
    preferredDeliveryDate: {
      propDefinition: [
        picqer,
        "preferredDeliveryDate",
      ],
      optional: true,
    },
    customerRemarks: {
      propDefinition: [
        picqer,
        "customerRemarks",
      ],
      optional: true,
    },
    reference: {
      propDefinition: [
        picqer,
        "reference",
      ],
      optional: true,
    },
    invoiced: {
      propDefinition: [
        picqer,
        "invoiced",
      ],
      optional: true,
    },
    shippingProviderId: {
      propDefinition: [
        picqer,
        "shippingProviderId",
      ],
      optional: true,
    },
    partialDelivery: {
      propDefinition: [
        picqer,
        "partialDelivery",
      ],
      optional: true,
    },
    language: {
      propDefinition: [
        picqer,
        "language",
      ],
      optional: true,
    },
  },
  async additionalProps(fixedProps) {
    const props = {};
    const hasCustomerId = !!this.customerId;
    fixedProps.deliveryName.hidden = hasCustomerId;
    fixedProps.deliveryContactName.hidden = hasCustomerId;
    fixedProps.deliveryAddress.hidden = hasCustomerId;
    fixedProps.deliveryAddress2.hidden = hasCustomerId;
    fixedProps.deliveryZipcode.hidden = hasCustomerId;
    fixedProps.deliveryCity.hidden = hasCustomerId;
    fixedProps.deliveryRegion.hidden = hasCustomerId;
    fixedProps.deliveryCountry.hidden = hasCustomerId;
    fixedProps.invoiceName.hidden = hasCustomerId;
    fixedProps.invoiceContactName.hidden = hasCustomerId;
    fixedProps.invoiceAddress.hidden = hasCustomerId;
    fixedProps.invoiceAddress2.hidden = hasCustomerId;
    fixedProps.invoiceZipcode.hidden = hasCustomerId;
    fixedProps.invoiceCity.hidden = hasCustomerId;
    fixedProps.invoiceRegion.hidden = hasCustomerId;
    fixedProps.invoiceCountry.hidden = hasCustomerId;

    if (this.customerId) {
      const orderFields = await this.picqer.listOrderFields();
      for (const field of orderFields) {
        const propData = {
          type: `string${field.type === "multicheckbox"
            ? "[]"
            : ""}`,
          label: field.title,
          description: `Order field: ${field.title}`,
        };

        if (field.values.length) {
          propData.options = field.values;
        }

        props[field.idorderfield] = propData;
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      picqer,
      orderId,
      customerId,
      templateId,
      shippingProviderId,
      deliveryName,
      deliveryContactName,
      deliveryAddress,
      deliveryAddress2,
      deliveryZipcode,
      deliveryCity,
      deliveryRegion,
      deliveryCountry,
      invoiceName,
      invoiceContactName,
      invoiceAddress,
      invoiceAddress2,
      invoiceZipcode,
      invoiceCity,
      invoiceRegion,
      invoiceCountry,
      telephone,
      emailAddress,
      reference,
      customerRemarks,
      partialDelivery,
      discount,
      invoiced,
      preferredDeliveryDate,
      language,
      ...otherFields
    } = this;

    const response = await picqer.updateOrder({
      $,
      orderId,
      data: {
        idcustomer: customerId,
        idtemplate: templateId,
        idshippingprovider: shippingProviderId,
        deliveryname: deliveryName,
        deliverycontactname: deliveryContactName,
        deliveryaddress: deliveryAddress,
        deliveryaddress2: deliveryAddress2,
        deliveryzipcode: deliveryZipcode,
        deliverycity: deliveryCity,
        deliveryregion: deliveryRegion,
        deliverycountry: deliveryCountry,
        invoicename: invoiceName,
        invoicecontactname: invoiceContactName,
        invoiceaddress: invoiceAddress,
        invoiceaddress2: invoiceAddress2,
        invoicezipcode: invoiceZipcode,
        invoicecity: invoiceCity,
        invoiceregion: invoiceRegion,
        invoicecountry: invoiceCountry,
        telephone,
        emailaddress: emailAddress,
        reference,
        customerremarks: customerRemarks,
        partialdelivery: partialDelivery,
        discount: discount && parseFloat(discount),
        invoiced,
        preferreddeliverydate: preferredDeliveryDate,
        language,
        orderfields: Object.entries(otherFields)?.map(([
          key,
          value,
        ]) => ({
          idorderfield: parseInt(key),
          value: Array.isArray(value)
            ? value.join(";")
            : value,
        })),
      },
    });

    $.export("$summary", `Order updated successfully with ID ${orderId}`);
    return response;
  },
};

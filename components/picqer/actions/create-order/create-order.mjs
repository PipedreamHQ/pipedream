import { ConfigurationError } from "@pipedream/platform";
import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-create-order",
  name: "Create Picqer Order",
  description: "Create a new order in Picqer. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    picqer,
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
    shippingProviderId: {
      propDefinition: [
        picqer,
        "shippingProviderId",
      ],
      optional: true,
    },
    deliveryName: {
      propDefinition: [
        picqer,
        "deliveryName",
      ],
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
      hidden: true,
    },
    invoiceName: {
      propDefinition: [
        picqer,
        "invoiceName",
      ],
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
      description: "Country of invoice address (needs to be ISO 3166 2-char code).",
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
    reference: {
      propDefinition: [
        picqer,
        "reference",
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
    partialDelivery: {
      propDefinition: [
        picqer,
        "partialDelivery",
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
    invoiced: {
      propDefinition: [
        picqer,
        "invoiced",
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
    language: {
      propDefinition: [
        picqer,
        "language",
      ],
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
    products: {
      type: "string[]",
      label: "Products",
      description: "List of objects of products to add to the order. **Format: [{\"idproduct\": 123, \"productcode\": \"ABC123\", \"name\": \"Product Name\", \"remarks\": \"Product remarks\", \"amount\": 100, \"idvatgroup\": 123}]**",
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
          optional: !field.required,
        };

        if (field.values.length) {
          propData.options = field.values;
        }

        props[`id${field.idorderfield}`] = propData;
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      picqer,
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
      products,
      preferredDeliveryDate,
      language,
      ...otherFields
    } = this;

    if (!customerId && !deliveryName) {
      throw new ConfigurationError("Delivery Name is required if **Customer Id** is not provided");
    }
    if (!customerId && !deliveryCountry) {
      throw new ConfigurationError("Delivery Country is required if **Customer Id** is not provided");
    }

    const response = await picqer.createOrder({
      $,
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
        products: parseObject(products),
        orderfields: Object.entries(otherFields)?.map(([
          key,
          value,
        ]) => ({
          idorderfield: parseInt(key.replace("id", "")),
          value: Array.isArray(value)
            ? value.join(";")
            : value,
        })),
      },
    });

    $.export("$summary", `Order created successfully with ID ${response.idorder}`);
    return response;
  },
};

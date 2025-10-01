import { ConfigurationError } from "@pipedream/platform";
import { INVOICE_TYPES } from "../../common/constants.mjs";
import finmei from "../../finmei.app.mjs";
import { parseAsJSON } from "../../common/utils.mjs";

export default {
  key: "finmei-create-invoice",
  name: "Create Invoice",
  description:
    "Generates a new invoice within Finmei. [See the documentation](https://documenter.getpostman.com/view/835227/2s9YXh5NRs#01e4e494-2aaf-4d87-9b8d-e527b04af0a0)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    finmei,
    type: {
      type: "string",
      label: "Type",
      description: "The type of invoice to create",
      options: INVOICE_TYPES,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date showed in the invoice. Format: `YYYY-MM-DD`",
    },
    series: {
      type: "string",
      label: "Series",
      description: "Invoice series in string format",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Uppercase three letter currency code, e.g. `USD`",
    },
    buyer: {
      type: "object",
      label: "Buyer",
      description:
        "The buyer info, as an object. [See the documentation](https://documenter.getpostman.com/view/835227/2s9YXh5NRs#01e4e494-2aaf-4d87-9b8d-e527b04af0a0) for the properties. Example: `{ \"type\": \"company\", \"company_name\": \"My Company\" }`",
    },
    products: {
      type: "string[]",
      label: "Product(s)",
      description:
        "One or more products as JSON-stringified objects. [See the documentation](https://documenter.getpostman.com/view/835227/2s9YXh5NRs#01e4e494-2aaf-4d87-9b8d-e527b04af0a0) for the properties. Example: `{ \"name\": \"My Product\", \"units\": \"pcs\", \"quantity\": 2, \"price\": 10 }`",
    },
    useDefaultSellerInfo: {
      type: "boolean",
      label: "Use Default Seller Info",
      description:
        "If true, you do not need to provide seller info. Your business info and latest invoice information will be used.",
      optional: true,
      default: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in the request. [See the documentation](https://documenter.getpostman.com/view/835227/2s9YXh5NRs#01e4e494-2aaf-4d87-9b8d-e527b04af0a0) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    let products, buyer;
    try {
      const value = parseAsJSON(this.products);
      products = value.map(parseAsJSON);
    } catch (e) {
      throw new ConfigurationError(
        `Error parsing JSON value in \`Product(s)\` prop as JSON: \`${e}\``,
      );
    }
    try {
      buyer = parseAsJSON(this.buyer);
    } catch (e) {
      throw new ConfigurationError(
        `Error parsing JSON value in \`Product(s)\` prop as JSON: \`${e}\``,
      );
    }

    let additionalOptions = Object.fromEntries(
      Object.entries(this.additionalOptions ?? {}).map(([
        key,
        value,
      ]) => {
        // optional JSON parsing
        try {
          return [
            key,
            JSON.parse(value),
          ];
        } catch (e) {
          return [
            key,
            value,
          ];
        }
      }),
    );

    const response = await this.finmei.createInvoice({
      $,
      data: {
        type: this.type,
        invoice_date: this.date,
        series: this.series,
        currency: this.currency,
        use_default_seller_info: this.useDefaultSellerInfo,
        buyer,
        products,
        ...additionalOptions,
      },
    });
    $.export(
      "$summary",
      `Successfully created invoice (ID: ${response?.data?.id})`,
    );
    return response;
  },
};

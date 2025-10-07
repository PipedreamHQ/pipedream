import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../app/clientary.app";

export default defineAction({
  key: "clientary-create-estimate",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Estimate",
  description: "Creates a new estimate. [See docs here](https://www.clientary.com/api/estimates)",
  type: "action",
  props: {
    app,
    date: {
      type: "string",
      label: "Date",
      description: "The date of the estimate, e.g. `2022/11/17`",
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "Currency Code, e.g. `USD`, `EUR`",
    },
    number: {
      type: "string",
      label: "Number",
      description: "Estimate number. Must be unique, e.g. `101`",
      optional: true,
    },
    estimateItemsAttributes: {
      type: "string",
      label: "Estimate Items Attributes",
      description: "Estimate items attributes. Must be a valid JSON Array string, e.g. `[ { \"title\": \"foo\", \"quantity\": 1, \"price\": 100 }, { \"title\": \"bar\", \"quantity\": 2, \"price\": 200 } ]`",
      optional: true,
    },
  },
  async run({ $ }) {
    let estimateItemsAttributes;
    if (this.estimateItemsAttributes) {
      try {
        estimateItemsAttributes = JSON.parse(this.estimateItemsAttributes);
      } catch (err) {
        throw new ConfigurationError("`Estimate Items Attributes` must be a valid JSON Array string");
      }
    }
    const response = await this.app.getRequestMethod("createEstimate")({
      $,
      data: {
        date: this.date,
        currency_code: this.currencyCode,
        number: this.number,
        estimate_items_attributes: estimateItemsAttributes,
      },
    });
    $.export("$summary", `Successfully created an estimate (ID: ${response.id})`);
    return response;
  },
});

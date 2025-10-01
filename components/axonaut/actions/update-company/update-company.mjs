import app from "../../axonaut.app.mjs";

export default {
  name: "Update Company",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "axonaut-update-company",
  description: "Updates a company. [See documentation (Go to `PATCH /api/v2/companies/{companYid}`)](https://axonaut.com/api/v2/doc)",
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    name: {
      label: "Name",
      description: "The name of the company",
      type: "string",
    },
    comments: {
      label: "Comments",
      description: "The comments about the company",
      type: "string",
      optional: true,
    },
    currency: {
      label: "Currency",
      description: "The currency of the company. E.g `USD`",
      type: "string",
      default: "USD",
      optional: true,
    },
    customFields: {
      label: "Custom Fields",
      description: "The custom fields of the company. E.g `{ \"myCustomField\": \"myCustomValue\" }`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const customFields = typeof this.customFields === "string"
      ? JSON.parse(this.customFields)
      : this.customFields;

    const response = await this.app.updateCompany({
      $,
      companyId: this.companyId,
      data: {
        name: this.name,
        currency: this.currency,
        comments: this.comments,
        custom_fields: customFields,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated company with ID ${response.id}`);
    }

    return response;
  },
};

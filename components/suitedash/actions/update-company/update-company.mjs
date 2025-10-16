import suitedash from "../../suitedash.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "suitedash-update-company",
  name: "Update Company",
  description: "Updates an existing company's details in SuiteDash. [See the documentation](https://app.suitedash.com/secure-api/swagger)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    suitedash,
    companyId: {
      propDefinition: [
        suitedash,
        "companyId",
      ],
    },
    companyName: {
      propDefinition: [
        suitedash,
        "companyName",
      ],
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the company.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the company",
      optional: true,
    },
    companyAddress: {
      type: "string",
      label: "Company Address",
      description: "The full address of the company. Example: dba Staybridge Suites Mount Laurel 324 Church Road Mount Laurel, NJ 09478",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tags associated with the company",
      optional: true,
    },
    backgroundInfo: {
      type: "string",
      label: "Background Info",
      description: "Background information about the company",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.companyName
      && !this.website
      && !this.phone
      && !this.companyAddress
      && !this.tags
      && !this.backgroundInfo
    ) {
      throw new ConfigurationError("Please enter at least one field to update");
    }

    const response = await this.suitedash.updateCompany({
      $,
      companyId: this.companyId,
      data: {
        name: this.companyName,
        website: this.website,
        phone: this.phone,
        full_address: this.companyAddress,
        tags: this.tags,
        background_info: this.backgroundInfo,
      },
    });
    $.export("$summary", `Successfully updated company ${this.companyId}`);
    return response;
  },
};

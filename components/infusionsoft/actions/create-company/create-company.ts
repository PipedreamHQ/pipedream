import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { CreateCompanyParams } from "../../common/types/requestParams";

export default defineAction({
  name: "Create Company",
  description:
    "Create a new company (account) in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Company/operation/createCompany)",
  key: "infusionsoft-create-company",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The company's email address",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The company's phone number",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The company's website URL",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the company's address",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the company's address",
      optional: true,
    },
    locality: {
      type: "string",
      label: "City",
      description: "The city where the company is located",
      optional: true,
    },
    region: {
      type: "string",
      label: "State/Region",
      description: "The state or region where the company is located",
      optional: true,
    },
    regionCode: {
      type: "string",
      label: "State/Region Code",
      description: "An ISO 3166-2 Province Code (e.g., US-AZ)",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal/zip code",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The long-name descriptive version of the Country",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "An ISO 3166-2 Country Code (e.g., USA)",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes about the company",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description:
        "JSON array of custom field objects with id and content. Example: [{\"id\": \"1\", \"content\": \"value\"}]",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const companyName = (this.companyName ?? "").trim();
    if (!companyName) {
      throw new Error("Company name is required");
    }

    const params: CreateCompanyParams = {
      $,
      companyName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      website: this.website,
      addressLine1: this.addressLine1,
      addressLine2: this.addressLine2,
      locality: this.locality,
      region: this.region,
      regionCode: this.regionCode,
      postalCode: this.postalCode,
      country: this.country,
      countryCode: this.countryCode,
      notes: this.notes,
      customFields: this.customFields,
    };

    const result = await this.infusionsoft.createCompany(params);

    $.export(
      "$summary",
      `Successfully created company "${companyName}"`,
    );

    return result;
  },
});

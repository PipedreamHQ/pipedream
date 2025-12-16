import { ConfigurationError } from "@pipedream/platform";
import app from "../../upsales.app.mjs";

export default {
  key: "upsales-update-company",
  name: "Update Company",
  description: "Updates an existing company (account) in Upsales. [See the documentation](https://api.upsales.com/#3e8b5e8d-3f4a-4e8e-8b5e-8d3f4a4e8e8b)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "companyName",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        app,
        "companyPhone",
      ],
    },
    webpage: {
      propDefinition: [
        app,
        "companyWebpage",
      ],
    },
    users: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "string[]",
      label: "Users",
      description: "Select one or more users to associate with this company",
      optional: true,
    },
    custom: {
      propDefinition: [
        app,
        "companyCustom",
      ],
    },
  },
  async run({ $ }) {
    const custom = this.custom?.map((item) => {
      try {
        return typeof item === "string"
          ? JSON.parse(item)
          : item;
      } catch (e) {
        throw new ConfigurationError(`Invalid JSON in custom field: ${item}`);
      }
    });

    const response = await this.app.updateCompany({
      $,
      companyId: this.companyId,
      data: {
        name: this.name,
        phone: this.phone,
        webpage: this.webpage,
        users: this.users,
        custom,
      },
    });

    $.export("$summary", `Successfully updated company: ${this.name || this.companyId}`);
    return response;
  },
};


import { parseObject } from "../../common/utils.mjs";
import { PATCH_OPS } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-update-company",
  name: "Update Company",
  description: "Update an existing company (account) in Nutshell. [See the documentation](https://developers.nutshell.com/reference/48bf7b1de74805c35713fb7b3a9f1e52)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    companyId: {
      propDefinition: [
        nutshell,
        "companyId",
      ],
    },
    name: {
      type: "string",
      label: "Company Name",
      description: "Updated company name.",
      optional: true,
    },
    industryId: {
      propDefinition: [
        nutshell,
        "industryId",
      ],
      optional: true,
    },
    accountTypeId: {
      propDefinition: [
        nutshell,
        "accountTypeId",
      ],
      optional: true,
    },
    territoryId: {
      propDefinition: [
        nutshell,
        "territoryId",
      ],
      optional: true,
    },
    address: {
      type: "string[]",
      label: "Address",
      description: "Array of address objects as JSON strings (see Create Company).",
      optional: true,
    },
    email: {
      type: "string[]",
      label: "Email",
      description: "Array of email objects as JSON strings (see Create Company).",
      optional: true,
    },
    phone: {
      type: "string[]",
      label: "Phone",
      description: "Array of phone objects as JSON strings (see Create Company).",
      optional: true,
    },
    url: {
      type: "string[]",
      label: "URLs",
      description: "Array of URL objects as JSON strings (see Create Company).",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom field name->value pairs, e.g. `{\"Customer tier\":\"Gold\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const patches = [];

    if (this.name) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/name",
        value: this.name,
      });
    }
    if (this.industryId) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/links/industry",
        value: this.industryId,
      });
    }
    if (this.accountTypeId) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/links/accountType",
        value: this.accountTypeId,
      });
    }
    if (this.territoryId) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/links/territory",
        value: this.territoryId,
      });
    }
    if (this.email) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/email",
        value: parseObject(this.email),
      });
    }
    if (this.phone) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/phone",
        value: parseObject(this.phone),
      });
    }
    if (this.url) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/url",
        value: parseObject(this.url),
      });
    }
    if (this.address) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/addresses",
        value: parseObject(this.address),
      });
    }
    if (this.customFields) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/accounts/0/customFields",
        value: this.customFields,
      });
    }

    if (!patches?.length) {
      throw new ConfigurationError("Please provide at least one field to update.");
    }

    const updated = await this.nutshell.updateAccount({
      $,
      companyId: this.companyId,
      patches,
    });

    $.export("$summary", `Successfully updated company "${updated?.name ?? this.companyId}"`);
    return this.nutshell.formatCompany(updated);
  },
};

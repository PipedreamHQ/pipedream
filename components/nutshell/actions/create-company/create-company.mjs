import { parseObject } from "../../common/utils.mjs";
import { ENTITY_KEYS } from "../../common/constants.mjs";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-create-company",
  name: "Create Company",
  description: "Create a new company (account) in Nutshell. [See the documentation](https://developers.nutshell.com/reference/0e0199fef8e93c05437d3a33104886d1)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    name: {
      type: "string",
      label: "Company Name",
      description: "The name of the company/account.",
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
      description: "Array of address objects. Each item is a JSON string, e.g. `{\"name\":\"HQ\",\"address_1\":\"123 Main St\",\"city\":\"Austin\"}`.",
      optional: true,
    },
    email: {
      type: "string[]",
      label: "Email",
      description: "Array of email objects. Each item is a JSON string, e.g. `{\"isPrimary\":true,\"value\":\"info@acme.com\"}`.",
      optional: true,
    },
    phone: {
      type: "string[]",
      label: "Phone",
      description: "Array of phone objects. Each item is a JSON string, e.g. `{\"isPrimary\":true,\"value\":\"+15125551234\"}`.",
      optional: true,
    },
    url: {
      type: "string[]",
      label: "URLs",
      description: "Array of URL objects. Each item is a JSON string, e.g. `{\"value\":\"https://acme.com\"}`.",
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
    const links = {
      ...(this.industryId
        ? {
          industry: this.industryId,
        }
        : {}),
      ...(this.accountTypeId
        ? {
          accountType: this.accountTypeId,
        }
        : {}),
      ...(this.territoryId
        ? {
          territory: this.territoryId,
        }
        : {}),
    };

    const accountData = {
      name: this.name,
      customFields: this.customFields,
      ...(Object.keys(links).length
        ? {
          links,
        }
        : {}),
      ...(this.email
        ? {
          email: parseObject(this.email),
        }
        : {}),
      ...(this.phone
        ? {
          phone: parseObject(this.phone),
        }
        : {}),
      ...(this.url
        ? {
          url: parseObject(this.url),
        }
        : {}),
      ...(this.address
        ? {
          addresses: parseObject(this.address),
        }
        : {}),
    };

    const account = await this.nutshell.createAccount({
      $,
      data: {
        [ENTITY_KEYS.ACCOUNTS]: [
          accountData,
        ],
      },
    });

    $.export("$summary", `Successfully created company "${account?.name ?? this.name}" (ID: ${account?.id})`);
    return this.nutshell.formatCompany(account);
  },
};

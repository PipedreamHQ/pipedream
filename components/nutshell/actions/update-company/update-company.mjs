import { parseObject } from "../../common/utils.mjs";
import nutshell from "../../nutshell.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "nutshell-update-company",
  name: "Update Company",
  description: "Update an existing company (account). Only provided fields are updated. Custom fields from your Nutshell pipeline can be set below or passed via the Custom Fields (Object) prop. [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#a0800d52996b40c90db3f475f88aaceb3)",
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
      type: "string",
      label: "Company ID",
      description: "The ID of the company (account) to update.",
      reloadProps: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
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
    url: {
      type: "string[]",
      label: "URLs",
      description: "The URLs of the company.",
      optional: true,
    },
    email: {
      propDefinition: [
        nutshell,
        "email",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        nutshell,
        "phone",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        nutshell,
        "address",
      ],
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields (Object)",
      description: "Optional object of custom field names to values, e.g. { \"Field Name\": \"value\" }. You can pass this from a previous step. Merged with any individual custom field inputs below.",
      optional: true,
    },
  },
  async additionalProps() {
    const { result: { Accounts: fields = [] } = {} } = await this.getCustomFields();
    const props = {};
    let i = 0;
    for (const field of fields) {
      i++;
      props[`customField_${i}`] = {
        type: "string",
        label: field.name,
        description: `Custom field ${i}.`,
        optional: true,
      };
    }
    return props;
  },
  methods: {
    async getCustomFields() {
      return await this.nutshell.post({
        method: "findCustomFields",
      });
    },
    async parseCustomFields(props) {
      const customFields = {};
      const { result: { Accounts = [] } = {} } = await this.getCustomFields();
      let i = 0;
      for (const field of Accounts) {
        i++;
        if (props[`customField_${i}`]) {
          customFields[field.name] = props[`customField_${i}`];
        }
      }
      return customFields;
    },
  },
  async run({ $ }) {
    const existing = await this.nutshell.getAccount({
      $,
      companyId: this.companyId,
    });
    if (!existing) {
      throw new ConfigurationError(`Company not found: ${this.companyId}`);
    }
    const rev = existing.rev ?? null;

    const account = {};
    if (this.companyName != null && this.companyName !== "") account.name = this.companyName;
    if (this.industryId != null) account.industryId = this.industryId;
    if (this.accountTypeId != null) account.accountTypeId = this.accountTypeId;
    if (this.territoryId != null) account.territoryId = this.territoryId;
    if (this.url != null) account.url = parseObject(this.url);
    if (this.email != null) account.email = parseObject(this.email);
    if (this.phone != null) account.phone = parseObject(this.phone);
    if (this.address != null) account.address = parseObject(this.address);
    const customFieldsFromProps = await this.parseCustomFields(this);
    const customFieldsObject = this.customFields
      ? parseObject(this.customFields)
      : {};

    const hasCustomFields = Object.keys(customFieldsFromProps).length > 0
      || Object.keys(customFieldsObject).length > 0;
    if (hasCustomFields) {
      account.customFields = {
        ...(existing.customFields ?? {}),
        ...customFieldsObject,
        ...customFieldsFromProps,
      };
    }

    if (Object.keys(account).length === 0) {
      throw new ConfigurationError("Please provide at least one field to update.");
    }

    const updated = await this.nutshell.editAccount({
      $,
      companyId: this.companyId,
      rev,
      account,
    });
    $.export("$summary", `Successfully updated company "${updated?.name ?? this.companyId}"`);
    return this.nutshell.formatCompany(updated);
  },
};

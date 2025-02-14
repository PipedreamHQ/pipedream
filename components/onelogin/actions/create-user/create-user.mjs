import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-create-user",
  name: "Create User",
  description: "Creates a new user in OneLogin. [See the documentation](https://developers.onelogin.com/api-docs/1/users/create-user)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    onelogin,
    firstname: {
      propDefinition: [
        onelogin,
        "firstname",
      ],
    },
    lastname: {
      propDefinition: [
        onelogin,
        "lastname",
      ],
    },
    email: {
      propDefinition: [
        onelogin,
        "email",
      ],
      optional: true,
    },
    username: {
      propDefinition: [
        onelogin,
        "username",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        onelogin,
        "company",
      ],
      optional: true,
    },
    department: {
      propDefinition: [
        onelogin,
        "department",
      ],
      optional: true,
    },
    directoryId: {
      propDefinition: [
        onelogin,
        "directoryId",
      ],
      optional: true,
    },
    distinguishedName: {
      propDefinition: [
        onelogin,
        "distinguishedName",
      ],
      optional: true,
    },
    externalId: {
      propDefinition: [
        onelogin,
        "externalId",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        onelogin,
        "groupId",
      ],
      optional: true,
    },
    invalidLoginAttempts: {
      propDefinition: [
        onelogin,
        "invalidLoginAttempts",
      ],
      optional: true,
    },
    localeCode: {
      propDefinition: [
        onelogin,
        "localeCode",
      ],
      optional: true,
    },
    memberOf: {
      propDefinition: [
        onelogin,
        "memberOf",
      ],
      optional: true,
    },
    openidName: {
      propDefinition: [
        onelogin,
        "openidName",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        onelogin,
        "phone",
      ],
      optional: true,
    },
    samaccountname: {
      propDefinition: [
        onelogin,
        "samaccountname",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        onelogin,
        "title",
      ],
      optional: true,
    },
    customAttributes: {
      propDefinition: [
        onelogin,
        "customAttributes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !this.username) {
      throw new ConfigurationError("Either email or username must be provided.");
    }

    const response = await this.onelogin.createUser({
      $,
      data: {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        username: this.username,
        company: this.company,
        department: this.department,
        directory_id: this.directoryId,
        distinguished_name: this.distinguishedName,
        external_id: this.externalId,
        group_id: this.groupId,
        invalid_login_attempts: this.invalidLoginAttempts,
        locale_code: this.localeCode,
        member_of: this.memberOf,
        openid_name: this.openidName,
        phone: this.phone,
        samaccountname: this.samaccountname,
        title: this.title,
        custom_attributes: parseObject(this.customAttributes),
      },
    });

    $.export("$summary", `Created user ${response.username} with ID ${response.id}`);
    return response;
  },
};

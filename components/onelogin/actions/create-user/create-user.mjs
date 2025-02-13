import onelogin from "../../onelogin.app.mjs";
import { axios } from "@pipedream/platform";

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
      throw new Error("Either email or username must be provided.");
    }

    const userData = {
      firstname: this.firstname,
      lastname: this.lastname,
      ...(this.email
        ? {
          email: this.email,
        }
        : {}),
      ...(this.username
        ? {
          username: this.username,
        }
        : {}),
      ...(this.company != null
        ? {
          company: this.company,
        }
        : {}),
      ...(this.department != null
        ? {
          department: this.department,
        }
        : {}),
      ...(this.directoryId != null
        ? {
          directory_id: this.directoryId,
        }
        : {}),
      ...(this.distinguishedName != null
        ? {
          distinguished_name: this.distinguishedName,
        }
        : {}),
      ...(this.externalId != null
        ? {
          external_id: this.externalId,
        }
        : {}),
      ...(this.groupId != null
        ? {
          group_id: parseInt(this.groupId, 10),
        }
        : {}),
      ...(this.invalidLoginAttempts != null
        ? {
          invalid_login_attempts: this.invalidLoginAttempts,
        }
        : {}),
      ...(this.localeCode != null
        ? {
          locale_code: this.localeCode,
        }
        : {}),
      ...(this.memberOf != null
        ? {
          member_of: this.memberOf,
        }
        : {}),
      ...(this.openidName != null
        ? {
          openid_name: this.openidName,
        }
        : {}),
      ...(this.phone != null
        ? {
          phone: this.phone,
        }
        : {}),
      ...(this.samaccountname != null
        ? {
          samaccountname: this.samaccountname,
        }
        : {}),
      ...(this.title != null
        ? {
          title: this.title,
        }
        : {}),
      ...(this.customAttributes != null
        ? {
          custom_attributes: this.customAttributes,
        }
        : {}),
    };

    const response = await this.onelogin.createUser(userData);

    $.export("$summary", `Created user ${response.username} with ID ${response.id}`);
    return response;
  },
};

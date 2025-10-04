import { parseObject } from "../../common/utils.mjs";
import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-update-user",
  name: "Update User",
  description: "Update an existing user's details in OneLogin. [See the documentation](https://developers.onelogin.com/api-docs/2/users/update-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    onelogin,
    userId: {
      propDefinition: [
        onelogin,
        "userId",
      ],
    },
    username: {
      propDefinition: [
        onelogin,
        "username",
      ],
      description: "The user's username",
      optional: true,
    },
    email: {
      propDefinition: [
        onelogin,
        "email",
      ],
      description: "The user's email address",
      optional: true,
    },
    firstname: {
      propDefinition: [
        onelogin,
        "firstname",
      ],
      optional: true,
    },
    lastname: {
      propDefinition: [
        onelogin,
        "lastname",
      ],
      optional: true,
    },
    password: {
      propDefinition: [
        onelogin,
        "password",
      ],
      optional: true,
    },
    passwordConfirmation: {
      propDefinition: [
        onelogin,
        "passwordConfirmation",
      ],
      optional: true,
    },
    passwordAlgorithm: {
      propDefinition: [
        onelogin,
        "passwordAlgorithm",
      ],
      optional: true,
    },
    salt: {
      propDefinition: [
        onelogin,
        "salt",
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
    department: {
      propDefinition: [
        onelogin,
        "department",
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
    comment: {
      propDefinition: [
        onelogin,
        "comment",
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
    roleIds: {
      propDefinition: [
        onelogin,
        "roleIds",
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
    state: {
      propDefinition: [
        onelogin,
        "state",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        onelogin,
        "status",
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
    trustedIdpId: {
      propDefinition: [
        onelogin,
        "trustedIdpId",
      ],
      optional: true,
    },
    managerUserId: {
      propDefinition: [
        onelogin,
        "userId",
      ],
      label: "Manager User ID",
      description: "The OneLogin User ID for the user's manager",
      optional: true,
    },
    samaccountname: {
      propDefinition: [
        onelogin,
        "samaccountname",
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
    userPrincipalName: {
      propDefinition: [
        onelogin,
        "userPrincipalName",
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
    openidName: {
      propDefinition: [
        onelogin,
        "openidName",
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
    preferredLocaleCode: {
      propDefinition: [
        onelogin,
        "preferredLocaleCode",
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
    mappings: {
      propDefinition: [
        onelogin,
        "mappings",
      ],
      optional: true,
    },
    validatePolicy: {
      propDefinition: [
        onelogin,
        "validatePolicy",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.onelogin.updateUser({
      $,
      userId: this.userId,
      data: {
        email: this.email,
        username: this.username,
        firstname: this.firstname,
        lastname: this.lastname,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
        password_algorithm: this.passwordAlgorithm,
        salt: this.salt,
        title: this.title,
        department: this.department,
        company: this.company,
        comment: this.comment,
        group_id: this.groupId,
        role_ids: parseObject(this.roleIds),
        phone: this.phone,
        state: this.state && parseInt(this.state),
        status: this.status && parseInt(this.status),
        directory_id: this.directoryId,
        trusted_idp_id: this.trustedIdpId,
        manager_user_id: this.managerUserId,
        samaccountname: this.samaccountname,
        member_of: this.memberOf,
        userprincipalname: this.userPrincipalName,
        distinguished_name: this.distinguishedName,
        external_id: this.externalId,
        openid_name: this.openidName,
        invalid_login_attempts: this.invalidLoginAttempts,
        preferred_locale_code: this.preferredLocaleCode,
        custom_attributes: this.customAttributes,
      },
      params: {
        mappings: this.mappings,
        validate_policy: this.validatePolicy,
      },
    });

    $.export("$summary", `Successfully updated user with ID: ${this.userId}`);
    return response;
  },
};

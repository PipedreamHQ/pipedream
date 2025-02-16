import onelogin from "../../onelogin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "onelogin-update-user",
  name: "Update User",
  description: "Updates an existing user's details in OneLogin. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    onelogin,
    updateUserId: {
      propDefinition: [
        onelogin,
        "updateUserId",
      ],
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
    userprincipalname: {
      propDefinition: [
        onelogin,
        "userprincipalname",
      ],
      optional: true,
    },
    managerAdId: {
      propDefinition: [
        onelogin,
        "manager_ad_id",
      ],
      optional: true,
    },
    managerUserId: {
      propDefinition: [
        onelogin,
        "manager_user_id",
      ],
      optional: true,
    },
    roleId: {
      propDefinition: [
        onelogin,
        "role_id",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const userId = this.updateUserId;
    const data = {};

    if (this.firstname) data.firstname = this.firstname;
    if (this.lastname) data.lastname = this.lastname;
    if (this.email) data.email = this.email;
    if (this.username) data.username = this.username;
    if (this.company) data.company = this.company;
    if (this.department) data.department = this.department;
    if (this.directoryId !== undefined) data.directory_id = this.directoryId;
    if (this.distinguishedName) data.distinguished_name = this.distinguishedName;
    if (this.externalId) data.external_id = this.externalId;
    if (this.groupId) data.group_id = parseInt(this.groupId, 10);
    if (this.invalidLoginAttempts !== undefined) data.invalid_login_attempts = this.invalidLoginAttempts;
    if (this.localeCode) data.locale_code = this.localeCode;
    if (this.memberOf) data.member_of = this.memberOf;
    if (this.openidName) data.openid_name = this.openidName;
    if (this.phone) data.phone = this.phone;
    if (this.samaccountname) data.samaccountname = this.samaccountname;
    if (this.title) data.title = this.title;
    if (this.customAttributes) data.custom_attributes = this.customAttributes;
    if (this.state !== undefined) data.state = this.state;
    if (this.status !== undefined) data.status = this.status;
    if (this.userprincipalname) data.userprincipalname = this.userprincipalname;
    if (this.managerAdId) data.manager_ad_id = this.managerAdId;
    if (this.managerUserId !== undefined) data.manager_user_id = this.managerUserId;
    if (this.roleId) {
      data.role_id = Array.isArray(this.roleId)
        ? this.roleId.map((id) => parseInt(id, 10))
        : parseInt(this.roleId, 10);
    }

    const response = await this.onelogin.updateUser(userId, data);
    $.export("$summary", `Successfully updated user with ID ${userId}`);
    return response;
  },
};

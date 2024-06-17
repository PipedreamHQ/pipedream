import acymailing from "../../acymailing.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "acymailing-add-update-user",
  name: "Add or Update User",
  description: "Creates a new user or updates an existing user in AcyMailing. If the user exists, will update the user's data with provided information. [See the documentation](https://docs.acymailing.com/v/rest-api/users#create-or-update-a-user)",
  version: "0.0.1",
  type: "action",
  props: {
    acymailing,
    email: {
      type: "string",
      label: "Email",
      description: "The email address is used when updating an existing user.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Any character should be available.",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Defaults to true.",
      optional: true,
    },
    confirmed: {
      type: "boolean",
      label: "Confirmed",
      description: "The confirmation is related to the \"Require confirmation\" option in the configuration, tab \"Subscription\".",
      optional: true,
    },
    cmsId: {
      type: "integer",
      label: "CMS Id",
      description: "The cms_id must match the ID of the corresponding Joomla/WordPress user.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "An object of field Ids and values.",
      optional: true,
    },
    triggers: {
      type: "boolean",
      label: "Triggers",
      description: "Defaults to true. Defines if the saving of the user triggers automated tasks like follow-up campaigns and automations.",
      optional: true,
    },
    sendConf: {
      type: "boolean",
      label: "Send Conf",
      description: "Defaults to true. Defines if the confirmation email should be sent when a new user is created.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.acymailing.createUserOrUpdate({
      $,
      data: {
        email: this.email,
        name: this.name,
        active: this.active,
        confirmed: this.confirmed,
        cmsId: this.cmsId,
        customFields: parseObject(this.customFields),
        triggers: this.triggers,
        sendConf: this.sendConf,
      },
    });
    $.export("$summary", `Successfully added or updated user with email with Id: ${response.userId}`);
    return response;
  },
};

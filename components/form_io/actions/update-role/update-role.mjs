import { ConfigurationError } from "@pipedream/platform";
import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-update-role",
  name: "Update Role",
  description: "Update a role in the Form.io project. Only the fields you provide are changed; omitted fields keep their current values. Obtain the role ID from **List Roles** (it is the role's 24-character hex `_id`, e.g. `64f8a1b2c3d4e5f60718293a`). Example: for `roleId` `64f8a1b2c3d4e5f60718293a`, set description to `Read-only reviewer` → returns the updated role. [See the documentation](https://apidocs.form.io/#6ad0536d-1927-41c5-b406-956ac736f9e5).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    formIo,
    roleId: {
      propDefinition: [
        formIo,
        "roleId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Updated title of the role.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Updated description of the role.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      roleId,
      title,
      description,
    } = this;

    // Send only the fields the user actually provided. Form.io's role PUT merges
    // the request body onto the existing document server-side (omitted fields keep
    // their current values), so we deliberately do NOT read-modify-write a full
    // snapshot: reading the whole role and PUTting it back would overwrite any
    // field a concurrent update changed in between (a lost update). By writing only
    // the changed fields, two concurrent updates to different fields both survive.
    const data = {};
    if (title !== undefined) {
      data.title = title;
    }
    if (description !== undefined) {
      data.description = description;
    }

    if (!Object.keys(data).length) {
      throw new ConfigurationError(
        "Provide at least one field to update (Title and/or Description).",
      );
    }

    const response = await this.formIo.updateRole({
      $,
      roleId,
      data,
    });

    $.export("$summary", `Updated role "${response.title}" (${response._id})`);
    return response;
  },
};

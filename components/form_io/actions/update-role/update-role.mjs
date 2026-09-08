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

    // Only the fields the user actually provided should change.
    const updates = {};
    if (title !== undefined) {
      updates.title = title;
    }
    if (description !== undefined) {
      updates.description = description;
    }

    if (!Object.keys(updates).length) {
      throw new ConfigurationError(
        "Provide at least one field to update (Title and/or Description).",
      );
    }

    // Form.io's role PUT replaces the whole document, so fetch the current role
    // and merge the requested changes onto it — otherwise an omitted field would
    // be blanked out instead of preserved.
    const current = await this.formIo.getRole({
      $,
      roleId,
    });

    const response = await this.formIo.updateRole({
      $,
      roleId,
      data: {
        ...current,
        ...updates,
      },
    });

    $.export("$summary", `Updated role "${response.title}" (${response._id})`);
    return response;
  },
};

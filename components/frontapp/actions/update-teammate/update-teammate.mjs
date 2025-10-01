import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-update-teammate",
  name: "Update Teammate",
  description: "Update a teammate. [See the documentation](https://dev.frontapp.com/reference/update-teammate).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    frontApp,
    teammateId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      description: "ID of the teammate to update",
    },
    username: {
      type: "string",
      label: "Username",
      description: "New username. It must be unique and can only contains lowercase letters, numbers and underscores",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "New first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "New last name",
      optional: true,
    },
    isAvailable: {
      type: "boolean",
      label: "Is Available",
      description: "New availability status",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for this teammate. If included, all current custom fields will be replaced with the object supplied here",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      frontApp,
      teammateId,
      username,
      firstName,
      lastName,
      isAvailable,
      customFields,
    } = this;

    const data = {
      username,
      first_name: firstName,
      last_name: lastName,
      is_available: isAvailable,
      custom_fields: customFields,
    };

    const response = await frontApp.updateTeammate({
      teammateId,
      data,
      $,
    });

    $.export("$summary", `Successfully updated teammate ${teammateId}`);
    return response;
  },
};

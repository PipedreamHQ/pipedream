import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-update-group",
  name: "Update Group",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update an existing group's information. [See the documentation](https://sendoso.docs.apiary.io/#reference/group-management)",
  type: "action",
  props: {
    sendoso,
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
    },
    name: {
      type: "string",
      label: "Group Name",
      description: "Updated name of the group.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Updated description of the group.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      groupId,
      name,
      description,
    } = this;

    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;

    const response = await this.sendoso.updateGroup({
      $,
      groupId,
      ...data,
    });

    $.export("$summary", `Successfully updated group ID: ${groupId}`);
    return response;
  },
};


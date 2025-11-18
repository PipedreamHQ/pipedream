import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-group",
  name: "Create Group",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new group in Sendoso. [See the documentation](https://sendoso.docs.apiary.io/#reference/group-management)",
  type: "action",
  props: {
    sendoso,
    name: {
      type: "string",
      label: "Group Name",
      description: "Name of the group.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the group.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      description,
    } = this;

    const data = {
      name,
    };
    if (description) data.description = description;

    const response = await this.sendoso.createGroup({
      $,
      ...data,
    });

    $.export("$summary", `Successfully created group: ${name}`);
    return response;
  },
};


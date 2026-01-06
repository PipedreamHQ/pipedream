import { DATA_TYPE_OPTIONS } from "../../common/constants.mjs";
import app from "../../retool.app.mjs";

export default {
  key: "retool-create-organization-user-attribute",
  name: "Create Organization User Attribute",
  description: "Create a new user attribute for the organization. [See the documentation](https://docs.retool.com/api/create-a-new-user-attribute-for-the-organization).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
    idempotentHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Attribute Name",
      description: "The name of the user attribute. Must be alphanumeric and without spaces.",
    },
    label: {
      type: "string",
      label: "Attribute Label",
      description: "A short description of the user attribute",
    },
    dataType: {
      type: "string",
      label: "Data Type",
      description: "The data type of the attribute",
      options: DATA_TYPE_OPTIONS,
    },
    defaultValue: {
      type: "string",
      label: "Default Value",
      description: "A default value to apply to users that don't have an attribute set",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;

    const response = await app.createOrgUserAttribute({
      $,
      data,
    });

    $.export("$summary", `Successfully created organization user attribute with ID: \`${response.data.id}\``);
    return response;
  },
};

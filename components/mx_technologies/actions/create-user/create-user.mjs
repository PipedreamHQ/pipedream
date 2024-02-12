import mxTechnologies from "../../mx_technologies.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mx_technologies-create-user",
  name: "Create User",
  description: "Creates a new user in the MX Technologies platform. [See the documentation](https://docs.mx.com/api-reference/platform-api/reference/create-user)",
  version: "0.0.1",
  type: "action",
  props: {
    mxTechnologies,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user to be created.",
    },
    id: {
      type: "string",
      label: "ID",
      description: "A unique identifier for the new user. (Optional)",
      optional: true,
    },
    isDisabled: {
      type: "boolean",
      label: "Is Disabled",
      description: "Flag to indicate if the user should be disabled. (Optional)",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional metadata for the user. (Optional)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mxTechnologies.createUser({
      email: this.email,
      id: this.id,
      isDisabled: this.isDisabled,
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully created user with email ${this.email}`);
    return response;
  },
};

import app from "../../crowdpower.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "crowdpower-upsert-customer",
  name: "Upsert Customer",
  description: "Create or update a customer. [See the documentation](https://documenter.getpostman.com/view/17896162/UV5TFKbh#9415bd14-59ab-47b1-b0ec-73826d9cb5db)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      description: "ID of the customer that will be created or updated",
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    customAttributes: {
      propDefinition: [
        app,
        "customAttributes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.upsertCustomer({
      $,
      data: {
        user_id: this.userId,
        email: this.email,
        name: this.name,
        custom_attributes: this.customAttributes && parseObject(this.customAttributes),
      },
    });
    $.export("$summary", response.success
      ? `Request succeeded with code ${response.code}`
      : `Request failed with code ${response.code}`);
    return response;
  },
};

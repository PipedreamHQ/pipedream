import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create User Invite",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-create-user-invite",
  description: "Create a user invite. [See the doc here](https://developers.waitwhile.com/reference/postinvites)",
  props: {
    waitwhile,
    name: {
      propDefinition: [
        waitwhile,
        "name",
      ],
    },
    email: {
      propDefinition: [
        waitwhile,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        waitwhile,
        "phone",
      ],
    },
    defaultLocationId: {
      label: "Default Location ID",
      type: "string",
      optional: true,
      description: "Identifier of location",
    },
    locationIds: {
      label: "Location IDs",
      type: "string[]",
      description: "Identifier of customer, automatically derived from visitor contact information if not provided.",
      optional: true,
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
    roles: {
      label: "Roles",
      type: "string[]",
      optional: true,
      description: "User roles",
    },
    resourceId: {
      propDefinition: [
        waitwhile,
        "resourceId",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      defaultLocationId: this.defaultLocationId,
      locationIds: this.locationIds,
      roles: this.roles,
      resourceId: this.resourceId,
    };

    try {
      const data = await this.waitwhile.createUserInvite(params);
      $.export("summary", `Successfully created a user invite with ID: ${data.id}`);

      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}`);
    }
  },
});

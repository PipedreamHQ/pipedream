import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create User Invite",
  version: "0.0.1",
  key: "waitwhile-create-user-invite",
  description: "Create a user invite",
  props: {
    waitwhile,
    name: {
      label: "Name",
      type: "string",
      description: "Name",
    },
    email: {
      label: "Email",
      type: "string",
      description: "Email address",
    },
    phone: {
      label: "Phone",
      type: "string",
      optional: true,
      description: "Phone number in E.164 format",
    },
    defaultLocationId: {
      label: "Default Location ID",
      type: "string",
      description: "Identifier of location",
    },
    locationIds: {
      propDefinition: [
        waitwhile,
        "locationIds",
      ],
    },
    roles: {
      label: "Roles",
      type: "string[]",
      description: "User roles",
    },
    resourceId: {
      label: "Resource ID",
      type: "string",
      description: "Identifier of resource",
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

    const data = await this.waitwhile.createUserInvites(params);
    $.export("summary", "Successfully created a user invite");
    return data;
  },
});

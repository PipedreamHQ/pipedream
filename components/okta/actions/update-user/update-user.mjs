import okta from "../../okta.app.mjs";

export default {
  key: "okta-update-user",
  name: "Update User",
  description: "Updates the profile of a specific user in the Okta system. [See the documentation](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/updateUser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    okta,
    userId: {
      propDefinition: [
        okta,
        "userId",
      ],
    },
    firstName: {
      propDefinition: [
        okta,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        okta,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        okta,
        "email",
      ],
      optional: true,
    },
    login: {
      propDefinition: [
        okta,
        "login",
      ],
      optional: true,
    },
    mobilePhone: {
      propDefinition: [
        okta,
        "mobilePhone",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        okta,
        "typeId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      okta,
      userId,
      typeId,
      ...profile
    } = this;

    const { profile: userProfile } = await okta.getUser({
      userId,
    });

    const response = await okta.updateUser({
      $,
      userId,
      data: {
        profile: {
          ...userProfile,
          ...profile,
        },
        ...(typeId
          ? {
            type: {
              id: this.typeId,
            },
          } :
          {}),
      },
    });

    $.export("$summary", `Successfully updated user with ID ${userId}`);
    return response;
  },
};

import app from "../../userflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "userflow-create-update-user",
  name: "Create or Update User",
  description: "Creates or updates a user in Userflow. If the user does not already exist in Userflow, it will be created. If it already exists, the given attributes will be merged into the existing user's attributes. [See the documentation](https://docs.userflow.com/api/users/create-or-update)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    attributes: {
      type: "object",
      label: "User Attributes",
      description: "A map with attributes to update for the user. You can add any attributes you want here. Existing attributes not included in the request will not be touched.",
      optional: true,
    },
    groups: {
      type: "string[]",
      label: "Groups",
      description: "Array of [group objects](https://userflow.com/docs/api#the-group-object) - A list of groups/companies to update and ensure the user is a member of. This field is simpler to use than memberships, if you don't use membership attributes. Eg. `{ \"id\": \"ab82c312-b3a4-4feb-870c-53dd336f955e\", \"attributes\": { \"name\": \"Acme Inc.\", \"billing_plan\": \"plus\" } }`. Only one of *Groups* and *Memberships* can be set.",
      optional: true,
    },
    memberships: {
      type: "string[]",
      label: "Memberships",
      description: "Array of [group membership objects](https://userflow.com/docs/api#the-group-membership-object) - A list of group/company memberships to create/update for the user. Memberships can hold attributes that describe the user's role for just this group (e.g. their access level). Each membership object must include an embedded [group object](https://userflow.com/docs/api#the-group-object) with the group's `id` as a minimum. Eg. `{ \"attributes\": { \"role\": \"admin\" }, \"group\": { \"id\": \"ab82c312-b3a4-4feb-870c-53dd336f955e\", \"attributes\": { \"name\": \"Acme Inc.\", \"billing_plan\": \"plus\" } } }`. Only one of *Groups* and *Memberships* can be set.",
      optional: true,
    },
  },
  methods: {
    createUpdateUser(args = {}) {
      return this.app.post({
        path: "/users",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createUpdateUser,
      userId,
      attributes,
      groups,
      memberships,
    } = this;

    const response = await createUpdateUser({
      $,
      data: {
        id: userId,
        attributes,
        groups: utils.parseMapArray(groups),
        memberships: utils.parseMapArray(memberships),
      },
    });

    $.export("$summary", `Successfully created or updated user with ID \`${response.id}\``);
    return response;
  },
};

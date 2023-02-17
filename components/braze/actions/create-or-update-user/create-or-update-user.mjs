import app from "../../braze.app.mjs";

export default {
  key: "braze-create-or-update-user",
  name: "Create Or Update User",
  description: "Creates or updates a user. [Create User](https://www.braze.com/docs/api/endpoints/scim/post_create_user_account/) and [Update User](https://www.braze.com/docs/api/endpoints/scim/put_update_existing_user_account/).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    userAliasName: {
      propDefinition: [
        app,
        "userAliasName",
      ],
    },
    userAliasLabel: {
      propDefinition: [
        app,
        "userAliasLabel",
      ],
    },
    userExternalId: {
      optional: true,
      propDefinition: [
        app,
        "userExternalId",
      ],
    },
  },
  methods: {
    createNewUserAliases(args = {}) {
      return this.app.create({
        path: "/users/alias/new",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      userExternalId,
      userAliasName,
      userAliasLabel,
    } = this;

    const response = await this.sendMessage({
      data: {
        user_aliases: [
          {
            user_alias: {
              external_id: userExternalId,
              alias_name: userAliasName,
              alias_label: userAliasLabel,
            },
          },
        ],
      },
    });

    step.export("$summary", "Successfully created or updated user");

    return response;
  },
};

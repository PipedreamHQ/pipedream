import app from "../../braze.app.mjs";

export default {
  key: "braze-create-or-update-user",
  name: "Create Or Update User",
  description: "Creates or updates a user. [Create User](https://www.braze.com/docs/api/endpoints/scim/post_create_user_account/) and [Update User](https://www.braze.com/docs/api/endpoints/scim/put_update_existing_user_account/).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};

import app from "../../redmine.app.mjs";

export default {
  key: "redmine-delete-user",
  name: "Delete User",
  description: "Deletes a user from the Redmine platform. [See the documentation](https://www.redmine.org/projects/redmine/wiki/rest_users#delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  methods: {
    deleteUser({
      userId, ...args
    } = {}) {
      return this.app.delete({
        path: `/users/${userId}.json`,
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      deleteUser,
      userId,
    } = this;

    return deleteUser({
      step,
      userId,
      summary: () => "Successfully deleted user",
    });
  },
};

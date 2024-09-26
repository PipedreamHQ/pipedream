import common from "../common/common.mjs";

export default {
  ...common,
  key: "mojo_helpdesk-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user is created. [See the docs here](https://github.com/mojohelpdesk/mojohelpdesk-api-doc#users)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources(params) {
      return this.mojoHelpdesk.listUsers({
        params: {
          ...params,
          sort_by: this.getSortField(),
          sort_order: "desc",
        },
      });
    },
    getSortField() {
      return "created_on";
    },
    generateMeta({
      id, first_name: firstName, last_name: lastName, created_on: createdOn,
    }) {
      const summary = firstName || lastName
        ? `${firstName || ""} ${lastName || ""}`
        : `User ID: ${id}`;
      return {
        id,
        summary,
        ts: Date.parse(createdOn),
      };
    },
  },
};

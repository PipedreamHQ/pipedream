import app from "../../badger_maps.app.mjs";

export default {
  key: "badger_maps-search-user",
  name: "Search User",
  description: "Find an existing Badger User at your company by User's email address or internal ID. [See the docs](https://badgerupdatedapi.docs.apiary.io/#reference/users/user-search/search-users).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Email Address or Badger User ID.",
    },
  },
  methods: {
    searchUser(args = {}) {
      return this.app.makeRequest({
        path: "/search/users/",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.searchUser({
      step,
      params: {
        q: this.query,
      },
    });

    if (response.length) {
      step.export("$summary", `Succesfully found ${response.length} user(s)`);
    } else {
      step.export("$summary", "No users found");
    }

    return response;
  },
};

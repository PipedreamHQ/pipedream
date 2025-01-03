import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-view-user",
  name: "View User",
  description: "View your user information. [See the documentation](https://developers.zoom.us/docs/api/users/#tag/users/GET/users/{userId})",
  version: "0.1.5",
  type: "action",
  props: {
    zoom,
  },
  methods: {
    getUser(args = {}) {
      return this.zoom._makeRequest({
        path: "/users/me",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.getUser({
      $,
    });
    $.export("$summary", `Successfully retrieved user with ID: ${response.id}`);
    return response;
  },
};

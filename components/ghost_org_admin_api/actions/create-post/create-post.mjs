import ghostAdminApi from "../../ghost_org_admin_api.app.mjs";

export default {
  key: "ghost_org_admin_api-create-post",
  name: "Create post",
  description: "Create a post. [See the docs here](https://ghost.org/docs/admin-api/#creating-a-post).",
  type: "action",
  version: "0.0.1",
  props: {
    ghostAdminApi,
  },
  async run() {},
};

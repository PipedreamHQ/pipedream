import smallImprovements from "../../small_improvements.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "small_improvements-list-users",
  name: "List All Users",
  description: "List all users from Small Improvements. [See the documentation](https://storage.googleapis.com/si-rest-api-docs/dist/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    smallImprovements,
  },
  async run({ $ }) {
    const response = await this.smallImprovements.listAllUsers();
    $.export("$summary", "Successfully listed all users");
    return response;
  },
};

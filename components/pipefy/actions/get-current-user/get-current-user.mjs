import pipefy from "../../pipefy.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "pipefy-get-current-user",
  name: "Get Current User",
  description: "Gets information of the current authenticated user. [See the docs here](https://api-docs.pipefy.com/reference/queries/me)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipefy,
  },
  async run({ $ }) {
    const userFields = constants.USER_FIELDS.join();
    const response = await this.pipefy.getAuthenticatedUser(userFields);
    $.export("$summary", "Successfully retrieved current user");
    return response;
  },
};

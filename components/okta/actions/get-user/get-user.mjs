import okta from "../../okta.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "okta-get-user",
  name: "Get User",
  description: "Fetches the information of a specific user from the Okta system. [See the documentation](https://developer.okta.com/docs/reference/api/users/#get-user)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    okta,
    userId: okta.propDefinitions.userId,
  },
  async run({ $ }) {
    const response = await this.okta.fetchUser(this.userId);
    $.export("$summary", `Successfully fetched user details for user ID ${this.userId}`);
    return response;
  },
};

import okta from "../../okta.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "okta-update-user",
  name: "Update User",
  description: "Updates the profile and/or credentials of a specific user in the Okta system. The mandatory props are 'user ID' and the details that need to be updated.",
  version: "0.0.${ts}",
  type: "action",
  props: {
    okta,
    userId: okta.propDefinitions.userId,
    updateDetails: okta.propDefinitions.updateDetails,
  },
  async run({ $ }) {
    const response = await this.okta.updateUser(this.userId, this.updateDetails);
    $.export("$summary", `Successfully updated user with ID ${this.userId}`);
    return response;
  },
};

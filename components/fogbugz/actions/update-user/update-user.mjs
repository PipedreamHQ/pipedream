import fogbugz from "../../fogbugz.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fogbugz-update-user",
  name: "Update User",
  description: "Edits an existing user in FogBugz. [See the documentation](https://api.manuscript.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fogbugz,
    userId: fogbugz.propDefinitions.userId,
    userDetails: fogbugz.propDefinitions.userDetails,
    sEmail: fogbugz.propDefinitions.sEmail,
    sFullName: fogbugz.propDefinitions.sFullName,
  },
  async run({ $ }) {
    const response = await this.fogbugz.editUser({
      ixPerson: this.userId,
      userDetails: {
        ...(this.sEmail && {
          sEmail: this.sEmail,
        }),
        ...(this.sFullName && {
          sFullName: this.sFullName,
        }),
        ...this.userDetails,
      },
    });
    $.export("$summary", `Successfully updated user with ID ${this.userId}`);
    return response;
  },
};

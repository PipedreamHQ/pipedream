import brilliantDirectories from "../../brilliant-directories.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "brilliant-directories-create-user",
  name: "Create User",
  description: "Creates a new user record in the website database. [See the documentation](https://support.brilliantdirectories.com/support/solutions/articles/12000088887-api-overview-and-testing-the-api-from-admin-area)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    brilliantDirectories,
    userData: {
      propDefinition: [
        brilliantDirectories,
        "userData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.brilliantDirectories.createUser({
      userData: this.userData,
    });
    $.export("$summary", "Successfully created a new user record");
    return response;
  },
};

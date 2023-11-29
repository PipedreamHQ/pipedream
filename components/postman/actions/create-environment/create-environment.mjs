import postman from "../../postman.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "postman-create-environment",
  name: "Create Environment",
  description: "Creates a new environment in Postman. [See the documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    postman,
    newEnvironmentName: {
      type: "string",
      label: "New Environment Name",
      description: "The name for the new environment",
    },
  },
  async run({ $ }) {
    const response = await this.postman.createEnvironment(this.newEnvironmentName);
    $.export("$summary", `Successfully created a new environment named ${this.newEnvironmentName}`);
    return response;
  },
};

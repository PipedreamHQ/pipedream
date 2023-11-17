import knorish from "../../knorish.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "knorish-create-user",
  name: "Create User",
  description: "Creates a new user on your Knorish site. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    knorish,
    newUserDetails: {
      propDefinition: [
        knorish,
        "newUserDetails",
      ],
    },
  },
  async run({ $ }) {
    const userDetails = this.newUserDetails;
    const response = await this.knorish.createUser(userDetails);

    $.export("$summary", `Successfully created a new user with ID: ${response.id}`);
    return response;
  },
};

import lokalise from "../../lokalise.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lokalise-create-project",
  name: "Create Project",
  description: "Initializes an empty project in Lokalise. [See the documentation](https://developers.lokalise.com/reference/create-a-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lokalise,
  },
  async run({ $ }) {
    const response = await axios(this.lokalise, {
      method: "POST",
      url: `${this.lokalise._baseUrl()}/projects`,
      headers: {
        "Authorization": `Bearer ${this.lokalise.$auth.oauth_access_token}`,
      },
    });

    $.export("$summary", `Successfully created project with ID: ${response.project_id}`);
    return response;
  },
};

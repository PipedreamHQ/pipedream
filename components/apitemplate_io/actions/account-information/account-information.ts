import app from "../../app/apitemplate_io.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Account Information",
  description: "Retrieves information about your account. [See the docs](https://apitemplate.io/apiv2/) for more information",
  key: "apitemplate_io-account-information",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    apiEndpoints: {
      propDefinition: [
        app,
        "apiEndpoints",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getAccountInformation($, this.apiEndpoints);
    $.export("$summary", `Successfully fetched your account information, status: ${response.status}`);
    return response;
  },
});

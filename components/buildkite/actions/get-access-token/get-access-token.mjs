import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-get-access-token",
  name: "Get Access Token",
  description: "Returns details about the API access token used to authenticate the request, including its scopes. [See the documentation](https://buildkite.com/docs/apis/rest-api/access-token)",
  version: "0.0.1",
  type: "action",
  props: {
    buildkite,
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: "/access-token",
    });
    $.export("$summary", `Token has scopes: ${response.scopes?.join(", ")}`);
    return response;
  },
};

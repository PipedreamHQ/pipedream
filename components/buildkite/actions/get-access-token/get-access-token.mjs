import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-get-access-token",
  name: "Get Access Token",
  description: "Returns details about the API access token used to authenticate the request, including its scopes. [See the documentation](https://buildkite.com/docs/apis/rest-api/access-token)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    buildkite,
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: "/access-token",
    });
    const scopes = response.scopes?.length
      ? response.scopes.join(", ")
      : "none";
    $.export("$summary", `Token has scopes: ${scopes}`);
    return response;
  },
};

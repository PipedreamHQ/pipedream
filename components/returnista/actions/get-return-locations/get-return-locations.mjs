import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-locations",
  name: "Get Return Locations",
  description: "Gets a list of return locations for the given account. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-locations)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    returnista,
  },
  async run({ $ }) {
    const { data: response } = await this.returnista.getReturnLocations({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} return location(s)`);
    return response;
  },
};

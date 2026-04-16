import elopage from "../../elopage.app.mjs";

export default {
  key: "elopage-list-funnels",
  name: "List Funnels",
  description: "List all funnels. See the documentation by importing \"https://api.myablefy.com/api/swagger_doc/\" into the [Swagger editor](https://editor-next.swagger.io/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elopage,
  },
  async run({ $ }) {
    const response = await this.elopage.listFunnels({
      $,
    });
    if (response.success) {
      $.export("$summary", `Successfully listed ${response.data.list?.length} funnel${response.data.list?.length === 1
        ? ""
        : "s"}`);
    }
    return response;
  },
};

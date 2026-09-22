import elopage from "../../elopage.app.mjs";

export default {
  key: "elopage-list-products",
  name: "List Products",
  description: "List all products. See the documentation by importing \"https://api.myablefy.com/api/swagger_doc/\" into the [Swagger editor](https://editor-next.swagger.io/)",
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
    const response = await this.elopage.listProducts({
      $,
    });
    $.export("$summary", `Successfully listed ${response?.length} product${response?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

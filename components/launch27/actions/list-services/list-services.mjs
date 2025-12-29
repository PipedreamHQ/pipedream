import launch27 from "../../launch27.app.mjs";

export default {
  key: "launch27-list-services",
  name: "List Services",
  description: "Lists all services. [See the documentation](https://bitbucket.org/awoo23/api-2.0/wiki/Services_for_booking)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    launch27,
  },
  async run({ $ }) {
    const response = await this.launch27.listServices({
      $,
    });
    $.export("$summary", `Successfully listed ${response.length} service${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

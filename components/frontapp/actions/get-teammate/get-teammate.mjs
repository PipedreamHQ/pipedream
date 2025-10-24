import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-teammate",
  name: "Get Teammate",
  description: "Retrieve a teammate by ID. [See the documentation](https://dev.frontapp.com/reference/get-teammate)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontApp,
    teammateId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      description: "ID of the teammate to get details of",
    },
  },
  async run({ $ }) {
    const response = await this.frontApp.getTeammate({
      $,
      teammateId: this.teammateId,
    });
    $.export("$summary", `Successfully retrieved teammate with ID: ${response.id}`);
    return response;
  },
};

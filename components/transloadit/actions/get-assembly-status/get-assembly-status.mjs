import transloadit from "../../transloadit.app.mjs";

export default {
  key: "transloadit-get-assembly-status",
  name: "Get Assembly Status",
  description: "Retrieve the current status and results of an existing assembly. [See the documentation](https://transloadit.com/docs/api/assemblies-assembly-id-get/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    transloadit,
    assemblyId: {
      propDefinition: [
        transloadit,
        "assemblyId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.transloadit.getAssemblyStatus(this.assemblyId);
    $.export("$summary", `Successfully retrieved assembly status for ${this.assemblyId}`);
    return response;
  },
};

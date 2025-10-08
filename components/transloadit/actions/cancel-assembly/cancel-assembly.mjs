import transloadit from "../../transloadit.app.mjs";

export default {
  key: "transloadit-cancel-assembly",
  name: "Cancel Assembly",
  description: "Cancel a running assembly by its assembly ID. Useful for aborting processing jobs that are no longer needed. [See the documentation](https://transloadit.com/docs/api/assemblies-assembly-id-delete/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.transloadit.cancelAssembly(this.assemblyId);

    $.export("$summary", `Successfully canceled assembly with ID ${this.assemblyId}`);
    return response;
  },
};

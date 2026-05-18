import agrello from "../../agrello.app.mjs";

export default {
  key: "agrello-list-folder-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available options for the Folder ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agrello,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await agrello.propDefinitions.folderId.options
        .call(this.agrello, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};

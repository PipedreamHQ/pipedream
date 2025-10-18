import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-list-file-uploads",
  name: "List File Uploads",
  description: "Use this action to list file uploads. [See the documentation](https://developers.notion.com/reference/list-file-uploads)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
  },
  async run({ $ }) {
    const response = this.notion.paginate({
      fn: this.notion.listFileUploads,
    });

    const responseArray = [];

    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully retrieved ${responseArray.length} file uploads`);
    return responseArray;
  },
};

import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";

export default {
  name: "List Folder Contents",
  description: "Returns the files and folders contained in a Box folder. Each item includes its ID, name, and type (file or folder), making it easy to navigate the folder hierarchy across multiple calls. [See the documentation](https://developer.box.com/reference/get-folders-id-items)",
  key: "box-list-folder-contents",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder to list. Use `0` for the root folder. The ID for any folder can be determined by visiting this folder in the web application and copying the ID from the URL",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items to return per page. Defaults to 100.",
      optional: true,
      min: 1,
      max: 1000,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The offset of the item at which to begin the response. Use with `Limit` to paginate through results.",
      optional: true,
      min: 0,
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const {
      folderId,
      limit,
      offset,
      fields,
    } = this;

    if (!folderId) {
      throw new ConfigurationError("**Folder ID** is required");
    }

    const response = await this.app.getItems({
      $,
      folderId,
      params: {
        limit,
        offset,
        fields: fields?.join(","),
      },
    });

    $.export("$summary", `Successfully listed \`${response?.entries?.length}\` item${response.entries.length === 1
      ? ""
      : "s"} in folder \`${folderId}\``);

    return response;
  },
};

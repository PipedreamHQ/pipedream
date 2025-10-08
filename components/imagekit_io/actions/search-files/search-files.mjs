import { FILE_SORT } from "../../common/constants.mjs";
import imagekitIo from "../../imagekit_io.app.mjs";

export default {
  key: "imagekit_io-search-files",
  name: "Search Files",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List all the uploaded files and folders in your ImageKit.io media library. [See the documentation](https://docs.imagekit.io/api-reference/media-api/list-and-search-files#list-and-search-file-api)",
  type: "action",
  props: {
    imagekitIo,
    type: {
      type: "string",
      label: "Type",
      description: "Limit search to one of **file**, **file-version**, or **folder**. Pass **all** to include files and folders in search results (**file-version** will not be included in this case).",
      options: [
        "file",
        "file-version",
        "folder",
        "all",
      ],
      default: "file",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The sort of the response.",
      options: FILE_SORT,
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description: "Folder path if you want to limit the search within a specific folder.",
      optional: true,
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "Query string in a Lucene-like query language. `Note`: When the **searchQuery** parameter is present, the following query parameters will have no effect on the result: **tags**, **type**, **name**.",
      optional: true,
    },
    fileType: {
      type: "string",
      label: "File Type",
      description: "Type of files to include in the result set.",
      options: [
        "all",
        "image",
        "non-image",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      imagekitIo,
      ...data
    } = this;

    const items = imagekitIo.paginate({
      fn: imagekitIo.searchFiles,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      params: data,
    });

    const responseArray = [];
    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} file${responseArray.length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return responseArray;
  },
};

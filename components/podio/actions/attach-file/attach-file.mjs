import app from "../../podio.app.mjs";

export default {
  key: "podio-attach-file",
  name: "Attach File",
  description: "Attaches an uploaded file to the given object. [See the documentation](https://developers.podio.com/doc/files/attach-file-22518)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file to attach to an object.",
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of object the file should be attached to.",
      options: [
        "status",
        "item",
        "comment",
        "space",
        "task",
      ],
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The id of the object the file should be attached to.",
    },
  },
  methods: {
    attachFile({
      fileId, ...args
    }) {
      return this.app._makeRequest({
        path: `/file/${fileId}/attach/`,
        method: "POST",
        ...args,
      });
    },
  },
  async run({ $ }) {

    const {
      fileId,
      objectType,
      objectId,
    } = this;

    const response = await this.attachFile({
      $,
      fileId,
      data: {
        ref_type: objectType,
        ref_id: objectId,
      },
    });

    $.export("$summary", "Successfully attached file");
    return response;
  },
};

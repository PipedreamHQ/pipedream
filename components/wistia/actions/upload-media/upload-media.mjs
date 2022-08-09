import wistia from "../../wistia.app.mjs";

export default {
  name: "Upload Media",
  version: "0.0.1660064893",
  key: "wistia-upload-media",
  description: "Upload a media. [See docs here](https://wistia.com/support/developers/upload-api#examples)",
  type: "action",
  props: {
    wistia,
    name: {
      label: "Name",
      description: "The name of the media",
      type: "string",
    },
    projectId: {
      propDefinition: [
        wistia,
        "projectId",
      ],
    },
    fileUrl: {
      label: "File URL",
      description: "The URL of the file to upload",
      type: "string",
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New project uploaded with id ${data.id}`,
        ts: Date.parse(data.created),
      });
    },
  },
  async run({ $ }) {
    const response = await this.wistia.uploadMedia({
      $,
      data: {
        project_id: this.projectId,
        name: this.name,
        url: this.fileUrl,
      },
    });

    $.export("$summary", `Successfully upload media with id ${response.id}`);

    return response;
  },
};

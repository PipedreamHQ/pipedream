import app from "../../recruitis.app.mjs";

export default {
  key: "recruitis-create-job",
  name: "Create Job",
  description: "Creates a new job ad and puts it in classifieds. [See the documentation](https://docs.recruitis.io/api/#tag/Jobs/paths/~1jobs/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createJob({
      $,
      data: {
        description: this.description,
        title: this.title,
      },
    });

    $.export("$summary", `Successfully created job at: '${response.payload.edit_url}'`);

    return response;
  },
};

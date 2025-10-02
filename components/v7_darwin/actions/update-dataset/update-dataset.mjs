import app from "../../v7_darwin.app.mjs";

export default {
  key: "v7_darwin-update-dataset",
  name: "Update Dataset",
  description: "Update a dataset with the specified ID. [See the documentation](https://docs.v7labs.com/reference/update-dataset)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
    annotatorsCanCreateTags: {
      propDefinition: [
        app,
        "annotatorsCanCreateTags",
      ],
    },
    annotatorsCanInstantiateWorkflows: {
      propDefinition: [
        app,
        "annotatorsCanInstantiateWorkflows",
      ],
    },
    anyoneCanDoubleAssign: {
      propDefinition: [
        app,
        "anyoneCanDoubleAssign",
      ],
    },
    instructions: {
      propDefinition: [
        app,
        "instructions",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    public: {
      propDefinition: [
        app,
        "public",
      ],
    },
    reviewersCanAnnotate: {
      propDefinition: [
        app,
        "reviewersCanAnnotate",
      ],
    },
    workPrioritization: {
      propDefinition: [
        app,
        "workPrioritization",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateDataset({
      $,
      id: this.id,
      data: {
        annotators_can_create_tags: this.annotatorsCanCreateTags,
        annotators_can_instantiate_workflows: this.annotatorsCanInstantiateWorkflows,
        anyone_can_double_assign: this.anyoneCanDoubleAssign,
        instructions: this.instructions,
        name: this.name,
        public: this.public,
        reviewers_can_annotate: this.reviewersCanAnnotate,
        work_prioritization: this.workPrioritization,
      },
    });

    $.export("$summary", `Successfully updated Dataset with ID: '${this.id}'`);

    return response;
  },
};

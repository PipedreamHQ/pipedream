import app from "../../beanstalkapp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "beanstalkapp-create-repository",
  name: "Create Repository",
  description: "Creates a new repository. [See the docs](https://api.beanstalkapp.com/repository.html).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the repository.",
    },
    name: {
      description: "Name of the repository. Must be unique in account.",
      propDefinition: [
        app,
        "name",
      ],
    },
    colorLabel: {
      type: "string",
      label: "Color Label",
      description: "Color label of the repository. White by default.",
      optional: true,
      options: constants.COLOR_LABELS,
    },
    defaultBranch: {
      type: "string",
      label: "Default Branch",
      description: "Default branch of the repository. `master` by default.",
      optional: true,
    },
  },
  methods: {
    createRepository(args = {}) {
      return this.app.create({
        path: "/repositories",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      title,
      name,
      colorLabel,
      defaultBranch,
    } = this;

    const response = await this.createRepository({
      step,
      data: {
        repository: {
          type_id: constants.REPO_TYPE.GIT,
          title,
          name,
          color_label: colorLabel,
          default_branch: defaultBranch,
        },
      },
    });

    step.export("$summary", `Successfully created repository with ID ${response.repository.id}`);

    return response;
  },
};

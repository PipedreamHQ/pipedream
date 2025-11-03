import app from "../../new_relic.app.mjs";

export default {
  name: "New Deployment",
  description: "Create a new deployment mark. [See the docs here](https://docs.newrelic.com/docs/apm/new-relic-apm/maintenance/record-monitor-deployments/)",
  key: "new_relic-new-deployment",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    application: {
      propDefinition: [
        app,
        "application",
      ],
    },
    revision: {
      type: "string",
      label: "Revision",
      description: "The revision of the application to create the deployment for",
    },
    changelog: {
      type: "string",
      label: "Changelog",
      description: "The changelog for the deployment",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description for the deployment",
      optional: true,
    },
    user: {
      type: "string",
      label: "User",
      description: "The user for the deployment",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      application,
      revision,
      changelog,
      description,
      user,
    } = this;
    const data = {
      revision,
      changelog,
      description,
      user,
    };
    const res = await this.app.newDeployment(application, data, $);
    $.export("$summary", "New deployment created");
    return res;
  },
};

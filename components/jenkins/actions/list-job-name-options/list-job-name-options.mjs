import jenkins from "../../jenkins.app.mjs";

export default {
  key: "jenkins-list-job-name-options",
  name: "List Job Name Options",
  description: "Retrieves available options for the Job Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jenkins,
  },
  async run({ $ }) {
    const options = await jenkins.propDefinitions.jobName.options.call(this.jenkins);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

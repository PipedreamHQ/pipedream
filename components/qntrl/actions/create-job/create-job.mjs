import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-create-job",
  name: "Create Job",
  description: "Creates a new job in Qntrl. Requires 'title' and 'description' props for job definition. Optional props include 'job type' and 'priority'.",
  version: "0.0.1",
  type: "action",
  props: {
    qntrl,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the job.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the job.",
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "The type of the job. This is optional.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the job. This is optional.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.qntrl.createJob({
      title: this.title,
      description: this.description,
      jobType: this.jobType,
      priority: this.priority,
    });
    $.export("$summary", `Successfully created job with title "${this.title}"`);
    return response;
  },
};

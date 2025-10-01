import lighthouse from "../../lighthouse.app.mjs";

export default {
  name: "Create Milestone",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "lighthouse-create-milestone",
  description: "Creates a milestone. [See docs here](http://help.lighthouseapp.com/kb/api/milestones#create-milestone-code-post-projects-project_id-milestones-xml-code-)",
  type: "action",
  props: {
    lighthouse,
    projectId: {
      propDefinition: [
        lighthouse,
        "projectId",
      ],
    },
    title: {
      label: "Title",
      description: "Title of the milestone",
      type: "string",
    },
    body: {
      label: "Body",
      description: "Body of the milestone",
      type: "string",
    },
  },
  async run({ $ }) {
    const { milestone } = await this.lighthouse.createMilestone({
      $,
      projectId: this.projectId,
      data: {
        milestone: {
          title: this.title,
          goals: this.body,
        },
      },
    });

    if (milestone) {
      $.export("$summary", `Successfully created milestone with ID ${milestone.id}`);
    }

    return milestone;
  },
};

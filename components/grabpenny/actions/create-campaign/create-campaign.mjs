import grabpenny from "../../grabpenny.app.mjs";

export default {
  key: "grabpenny-create-campaign",
  name: "Create Campaign",
  description: "Creates a new campaign in GrabPenny. [See the documentation](https://grabpenny.com/api-docs/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    grabpenny,
    taskTypeId: {
      propDefinition: [
        grabpenny,
        "taskTypeId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the campaign",
    },
    link: {
      type: "string",
      label: "Link",
      description: "URL to the social media profile/content",
    },
    requiredExecutions: {
      type: "integer",
      label: "Required Executions",
      description: "Number of engagements required (min: 10)",
      min: 10,
    },
    maxPerDay: {
      type: "integer",
      label: "Max Per Day",
      description: "Maximum engagements per day (0 = unlimited)",
      optional: true,
    },
    miscData: {
      type: "object",
      label: "Misc Data",
      description: "Additional campaign data",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.grabpenny.createCampaign({
      $,
      data: {
        task_type_id: this.taskTypeId,
        name: this.name,
        link: this.link,
        required_executions: this.requiredExecutions,
        max_per_day: this.maxPerDay,
        misc_data: this.miscData
          ? typeof this.miscData === "string"
            ? JSON.parse(this.miscData)
            : this.miscData
          : undefined,
      },
    });
    if (response?.campaign?.id) {
      $.export("$summary", `Successfully created campaign with ID \`${response.campaign.id}\`.`);
    }
    return response;
  },
};

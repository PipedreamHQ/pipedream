import app from "../../stormboard.app.mjs";
import options from "../common/options.mjs";

export default {
  type: "action",
  key: "stormboard-new-storm",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "New Storm",
  description: "Creates a new storm. [See the docs here](https://api.stormboard.com/docs)",
  props: {
    app,
    plan: {
      type: "string",
      label: "Plan",
      description: "The type of plan to create this Storm under.",
      options: options.STORM_PLAN_OPTIONS,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the Storm.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the Storm.",
      optional: true,
    },
    votesPerUser: {
      type: "integer",
      label: "Votes Per User",
      description: "The number of votes each user gets. Between 0 and 100. Defaults to `10`.",
      min: 0,
      max: 100,
      optional: true,
    },
    avatars: {
      type: "boolean",
      label: "Avatars",
      description: "Show where each user is in realtime on the Storm wall with an avatar and name.",
      optional: true,
    },
    ideaCreator: {
      type: "boolean",
      label: "Idea Creator",
      description: "Show the idea creator's avatar on the corner of the idea",
      optional: true,
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The team's unique id. Required if the 'plan' parameter is set to 'team'. You must also be a Storm Administrator on this team to be able to create Storms.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      plan: this.plan,
      title: this.title,
      description: this.description,
      votesperuser: this.votesPerUser,
      avatars: this.avatars,
      ideacreator: this.ideaCreator,
      team_id: this.teamId,
    };
    const res = await this.app.createStorm(data);
    $.export("$summary", "Storm successfully created");
    return res;
  },
};

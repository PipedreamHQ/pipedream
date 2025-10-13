import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-create-channel",
  name: "Create Channel",
  description: "Create a new channel in Microsoft Teams. [See the docs here](https://docs.microsoft.com/en-us/graph/api/channel-post?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftTeams,
    teamId: {
      propDefinition: [
        microsoftTeams,
        "team",
      ],
    },
    displayName: {
      propDefinition: [
        microsoftTeams,
        "channelDisplayName",
      ],
    },
    description: {
      propDefinition: [
        microsoftTeams,
        "channelDescription",
      ],
    },
  },
  async run({ $ }) {
    const {
      teamId,
      displayName,
      description,
    } = this;

    const response =
      await this.microsoftTeams.createChannel({
        teamId,
        content: {
          displayName,
          description,
        },
      });

    $.export("$summary", `Successfully created channel ${displayName}`);

    return response;
  },
};

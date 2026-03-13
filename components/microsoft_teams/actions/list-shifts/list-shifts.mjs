import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-shifts",
  name: "List Shifts",
  description: "Get the list of shift instances for a team. [See the documentation](https://learn.microsoft.com/en-us/graph/api/schedule-list-shifts?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTeams,
    teamId: {
      propDefinition: [
        microsoftTeams,
        "team",
      ],
    },
  },
  async run({ $ }) {
    const paginator = this.microsoftTeams.paginate(this.microsoftTeams.listShifts, {
      teamId: this.teamId,
    });

    const shifts = [];
    for await (const shift of paginator) {
      shifts.push(shift);
    }

    $.export("$summary", `Successfully fetched ${shifts?.length} shift${shifts?.length === 1
      ? ""
      : "s"}.`);

    return shifts;
  },
};

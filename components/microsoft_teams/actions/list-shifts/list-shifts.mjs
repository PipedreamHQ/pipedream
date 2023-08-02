import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-list-shifts",
  name: "List Shifts",
  description: "Get the list of shift instances in a schedule. [See the documentation](https://learn.microsoft.com/en-us/graph/api/schedule-list-shifts?view=graph-rest-1.0&tabs=http)",
  type: "action",
  version: "0.0.1",
  props: {
    microsoftTeams,
    teamId: {
      propDefinition: [
        microsoftTeams,
        "team",
      ],
    },
  },
  methods: {
    listShifts() {
      return this.microsoftTeams.makeRequest({
        path: "",
      });
    },
  },
  async run({ $ }) {
    const shifts = [];

    $.export("$summary", `Successfully fetched ${shifts?.length} shift${shifts?.length === 1
      ? ""
      : "s"}.`);

    return shifts;
  },
};

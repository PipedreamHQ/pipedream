import app from "../../status_hero.app.mjs";

export default {
  type: "action",
  key: "status_hero-create-team-holiday",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Team Holiday",
  description: "Creates a team-wide holiday., [See the docs](https://api.statushero.com/#team-absences)",
  props: {
    app,
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.addTeamAbsence({
      $,
      data: {
        date: this.date,
      },
    });
    $.export("$summary", `Absence has been created. Date(${this.date})`);
    return resp;
  },
};

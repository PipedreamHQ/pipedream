import app from "../../beebole_app.app.mjs";

export default {
  name: "List untimed employees",
  description: "Get a list of employees without any time entry for a given period of time",
  key: "beebole_app-list-untimed-employees",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    begda: {
      propDefinition: [
        app,
        "begda",
      ],
    },
    endda: {
      propDefinition: [
        app,
        "endda",
      ],
    },
  },
  async run({ $ }) {
    let response,
      people = [];

    try {
      response = await this.app.apiRequest({
        $,
        data: {
          service: "time.get_people_timesheets",
          undoc: true,
          from: this.begda.split("-"),
          to: this.endda.split("-"),
          show: "all",
          statusFilters: [
            "d",
          ],
          showAll: true,
          details: [],
        },
      });

      $.export("$summary", `Successfully generated list for ${response.items[0].people.length} people`);

      response.items[0].people.forEach((element) => {
        people.push({
          name: element.doc.name,
          eid: element.eid,
          draft: element.hours.sum,
        });
      });
      return people;
    } catch (errors) {
      return errors;
    }
  },
};

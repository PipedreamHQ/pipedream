import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-moon-phases",
  name: "Moon Phases",
  description: "Retrieve the moon phase for a given date. [See the documentation](https://docs.apiverve.com/api/moonphases)",
  version: "0.0.1",
  type: "action",
  props: {
    apiverve,
    date: {
      type: "string",
      label: "Date",
      description: "The date for which you want to get the moon phase (e.g., MM-DD-YYYY : 01-01-2022)",
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.moonPhases({
      $,
      params: {
        date: this.date,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved moon phases for ${this.date}`);
    }
    return response;
  },
};

import klussenbeheer from "../../klussenbeheer.app.mjs";

export default {
  key: "klussenbeheer-get-planning",
  name: "Get Planning",
  description: "Get the jobs planned for today (`vandaag`), tomorrow (`morgen`) and the coming week (`komend`). [See the documentation](https://samdesk.nl/klussenbeheer/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    klussenbeheer,
  },
  async run({ $ }) {
    const planning = await this.klussenbeheer.getPlanning($);

    const count = Object.values(planning ?? {})
      .reduce((total, jobs) => total + (Array.isArray(jobs)
        ? jobs.length
        : 0), 0);
    $.export("$summary", `Fetched the planning: ${count} planned job${count === 1
      ? ""
      : "s"}`);

    return planning;
  },
};

import app from "../../google_slides.app.mjs";

export default {
  key: "google_slides-find-presentation",
  name: "Find a Presentation",
  description: "Search for a Google Slides presentation by name. Returns matching presentations with their `id`, `name`, and `url`. Use this first to resolve a presentation's name to its ID, then pass the `id` to **Get Presentation** or other Slides tools. [See the documentation](https://developers.google.com/drive/api/v3/search-files)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    drive: {
      propDefinition: [
        app,
        "watchedDrive",
      ],
      description: "The drive to search for a presentation. Defaults to searching across all drives. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select one here to narrow the search, e.g. `My Drive`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Text to search for in presentation names and contents. Matches presentations whose name or content contains this text. Example: `Q3 Board Deck`. Leave blank to list recent presentations.",
      optional: true,
    },
  },
  async run({ $ }) {
    const presentations = await this.app.findPresentations(this.drive, this.name);
    $.export("$summary", `Found ${presentations.length} presentation${presentations.length === 1
      ? ""
      : "s"}${this.name
      ? ` matching "${this.name}"`
      : ""}`);
    return presentations;
  },
};

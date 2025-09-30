import app from "../../supercast.app.mjs";

export default {
  key: "supercast-create-episode",
  name: "Create an Episode",
  description: "Creates a new episode on Supercast. [See the documentation](https://supercast.readme.io/reference/postepisodes)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the episode or question",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Summary of the episode",
      optional: true,
    },
    explicit: {
      type: "boolean",
      label: "Explicit Content",
      description: "Whether the episode contains explicit content.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) for the episode",
      optional: true,
    },
    publishedAt: {
      type: "string",
      label: "Published At",
      description: "The date and time when the episode should be published. Eg. `2020-01-01T00:00:00Z`",
      optional: true,
    },
  },
  methods: {
    yesOrNo(value) {
      return value === true
        ? "yes"
        : "no";
    },
    createEpisode(args = {}) {
      return this.app.post({
        path: "/episodes",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      yesOrNo,
      createEpisode,
      title,
      summary,
      explicit,
      language,
      publishedAt,
    } = this;

    const response = await createEpisode({
      $,
      data: {
        title,
        summary,
        explicit: yesOrNo(explicit),
        language,
        published_at: publishedAt,
      },
    });

    $.export("$summary", `Successfully created episode with ID \`${response.id}\``);
    return response;
  },
};

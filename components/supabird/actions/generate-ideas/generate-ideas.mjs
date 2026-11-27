import { ConfigurationError } from "@pipedream/platform";
import app from "../../supabird.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "supabird-generate-ideas",
  name: "Generate Post Ideas",
  description: "Generate post ideas in your own writing style or in the style of chosen X creators. This runs as a background job that usually takes under a minute; the action waits up to 2 minutes, so set the workflow timeout to at least 150 seconds. Generated ideas are saved in SupaBird and appear in the **New Saved Idea** source. This spends SupaBird credits. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    writingStyle: {
      type: "string",
      label: "Writing Style",
      description: "Whose voice the ideas are written in. `My style` uses your own voice; `Style of chosen creators` needs **Creators**.",
      options: constants.WRITING_STYLES,
    },
    ideaSource: {
      type: "string",
      label: "Idea Source",
      description: "Where the ideas come from: `user` (your own posts) or `creator` (the posts of the chosen **Creators**), e.g. `user`. Defaults to `creator` when **Writing Style** is `Style of chosen creators`, otherwise `user`.",
      options: constants.IDEA_SOURCES,
      optional: true,
    },
    creators: {
      type: "string[]",
      label: "Creators",
      description: "X usernames without `@`, up to 10, e.g. `[\"paulg\", \"naval\"]`. Required when **Writing Style** is `Style of chosen creators` or **Idea Source** is `creator`.",
      optional: true,
    },
    numberOfPosts: {
      type: "integer",
      label: "Number of Posts",
      description: "How many ideas to generate, from 5 to 20, e.g. `10`. Defaults to `10`.",
      min: 5,
      max: 20,
      default: 10,
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Free-form guidance on topics, tone or length, e.g. `Focus on lessons from building in public. Keep each idea under 200 characters.`",
      optional: true,
    },
    socialSet: {
      propDefinition: [
        app,
        "socialSet",
      ],
      description: "The social set to generate ideas for, e.g. `6af6f28f3d61850002518bfe`. Use **List Social Sets** to find it (the `id` field). Leave empty if your account has a single social set.",
    },
  },
  async run({ $ }) {
    const {
      app, writingStyle, ideaSource, creators, numberOfPosts, instructions, socialSet,
    } = this;

    const source = ideaSource ?? (writingStyle === "creators"
      ? "creator"
      : "user");
    if ((writingStyle === "creators" || source === "creator") && !creators?.length) {
      throw new ConfigurationError("**Creators** is required when **Writing Style** is `Style of chosen creators` or **Idea Source** is `creator`.");
    }

    const started = await app.generateIdeas({
      $,
      data: {
        writing_style: writingStyle,
        idea_source: source,
        creators: creators?.length
          ? creators
          : undefined,
        number_of_posts: numberOfPosts,
        instructions,
        social_set: socialSet,
      },
    });

    const job = await app.waitForJob({
      $,
      jobId: started.job_id,
      timeoutMs: constants.IDEAS_JOB_TIMEOUT_MS,
    });

    const posts = job.posts ?? [];
    $.export("$summary", `Generated ${posts.length} post idea${posts.length === 1
      ? ""
      : "s"}`);
    return posts;
  },
};

import wordpress from "../../wordpress_com.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "wordpress_com-new-post",
  name: "New Post",
  description: "Emit new event for each new post published since the last run. If no new posts, emit nothing.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    wordpress,
    db: "$.service.db",
    site: {
      propDefinition: [
        wordpress,
        "siteId",
      ],
    },
    type: {
      type: "string",
      label: "Post Type",
      description: "Select the type of content to fetch",
      options: [
        {
          label: "Post",
          value: "post",
        },
        {
          label: "Page",
          value: "page",
        },
        {
          label: "Attachment",
          value: "attachment",
        },
      ],
      default: "post",
    },
    number: {
      type: "integer",
      label: "Maximum Posts to Fetch",
      description: "The amount of most recent posts to fetch each time the source runs.",
      default: 10,
      optional: true,
      min: 1,
      max: 100,
    },
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "How often to poll WordPress for new posts.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getWordpressPosts($) {

      return this.wordpress.getWordpressPosts({
        $,
        site: this.site,
        type: this.type,
        number: this.number,
      });

    },
  },
  hooks: {
    async activate() {

      const {
        wordpress,
        db,
        type,
      } = this;

      await this.db.set("lastPostId", null); // reset

      const response = await this.getWordpressPosts();

      const posts = (type === "attachment")
        ? (response.media || [])
        : (response.posts || []);

      await wordpress.initialize(posts, db, "lastPostId");
    },
  },

  async run({ $ }) {
    const {
      wordpress,
      db,
      type,
    } = this;

    const response = await this.getWordpressPosts($);

    const posts = (type === "attachment")
      ? (response.media || [])
      : (response.posts || []);
    const lastPostId = Number(await db.get("lastPostId"));

    if (!lastPostId) await wordpress.initialize(posts, db, "lastPostId");

    let maxPostIdTracker = lastPostId;

    const newPosts = [];

    for (const post of posts) {
      if (Number(post.ID) > lastPostId) {
        newPosts.push(post);
        if (Number(post.ID) > maxPostIdTracker) {
          maxPostIdTracker = post.ID;
        }
      }
    }

    for (const post of newPosts.reverse()) {
      this.$emit(post, {
        id: post.ID,
        summary: post.title,
        ts: post.date && +new Date(post.date),
      });
    }

    // Update last seen post ID
    if (newPosts.length > 0) {
      await db.set("lastPostId", maxPostIdTracker);
      console.log(`Checked for new posts. Emitted ${newPosts.length} post(s).`);
    } else {
      console.log("No new posts found.");
    }
  },
};

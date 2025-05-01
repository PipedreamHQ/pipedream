import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-new-comment",
  name: "New Comment",
  description: "Emit new event for each new comment added since the last run. If no new comments, emit nothing.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    getWordpressComments($) {
      return this.wordpress.getWordpressComments({
        $,
        site: this.site,
        postId: this.postId,
        number: this.number,
      });
    },
  },
  props: {
    wordpress,
    db: "$.service.db",
    site: {
      propDefinition: [
        wordpress,
        "siteId",
      ],
    },
    postId: {
      propDefinition: [
        wordpress,
        "postId",
        (c) => ({
          site: c.site,
        }),
      ],
      description: "Enter a specific post ID to fetch comments for only that post. Leave empty to fetch all comments.",
      optional: true,
    },
    number: {
      type: "integer",
      label: "Maximum Comments to Fetch",
      description: "The number of most recent comments to fetch each time the source runs",
      default: 10,
      optional: true,
      min: 1,
      max: 100,
    },
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "How often to poll WordPress for new comments.",
    },
  },
  hooks: {
    async activate() {

      const warnings = [];

      const {
        wordpress,
        db,
        site,
      } = this;

      warnings.push(...wordpress.checkDomainOrId(site));

      if (warnings.length > 0) {
        console.log("Warnings:\n- " + warnings.join("\n- "));
      }

      await this.db.set("lastCommentId", null); //reset

      const response = await this.getWordpressComments(this.wordpress._mock$);

      const comments = response.comments || [];

      await wordpress.initialize(comments, db, "lastCommentId");
    },
  },

  async run({ $ }) {
    const warnings = [];

    const {
      wordpress,
      db,
      site,
    } = this;

    warnings.push(...wordpress.checkDomainOrId(site));

    let response;
    try {

      response = await this.getWordpressComments($);

    } catch (error) {
      wordpress.throwCustomError("Failed to fetch comments from WordPress:", error, warnings);
    }

    const comments = response.comments || [];
    const lastCommentId = Number(await db.get("lastCommentId"));

    if (!lastCommentId)  await wordpress.initialize(comments, db, "lastCommentId");

    let maxCommentIdTracker = lastCommentId;
    const newComments = [];

    for (const comment of comments) {
      if (Number(comment.ID) > lastCommentId) {
        newComments.push(comment);
        if (Number(comment.ID) > maxCommentIdTracker) {
          maxCommentIdTracker = comment.ID;
        }
      }
    }

    for (const comment of newComments.reverse()) {
      this.$emit(comment, {
        id: comment.ID,
        summary: comment.author?.name || "Anonymous Comment",
        ts: comment.date && +new Date(comment.date),
      });
    }

    // Update last seen comment ID
    if (newComments.length > 0) {
      await db.set("lastCommentId", maxCommentIdTracker);
      console.log(`Checked for new comments. Emitted ${newComments.length} comment(s).`);
    } else {
      console.log("No new comments found.");
    }

    if (warnings.length > 0) {
      console.log("Warnings:\n- " + warnings.join("\n- "));
    };
  },
};


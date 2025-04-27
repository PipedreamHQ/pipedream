import wordpress from "../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-new-comment",
  name: "New Comment",
  description: "Emit new event for each new comment added since the last run. If no new comments, emit nothing.",
  version: "0.0.1",
  type: "source",
  props: {
    wordpress,
    db: "$.service.db",
    site: {
      type: "string",
      label: "Site ID or domain",
      description: "Enter a site ID or domain (e.g. testsit38.wordpress.com). Do not include 'https://' or 'www'.",
    },
    postId: {
      type: "integer",
      label: "Post ID",
      description: "Enter a specific post ID to fetch comments for only that post. Leave empty to fetch all comments.",
      optional: true,
    },
    number: {
      type: "integer",
      label: "Maximum Comments to Fetch",
      description: "The number of most recent comments to fetch each time the source runs.",
      default: 10,
      optional: true,
      min: 1,
      max: 100,
    },

  },

  async run({ $ }) {

    const warnings = [];

    const {
      wordpress,
      db,
      site,
      postId,
      number,
    } = this;

    warnings.push(...wordpress.checkDomainOrId(site));

    let response;
    try {
      response = await wordpress.getWordpressComments({
        $,
        site,
        postId,
        number,
      });

    } catch (error) {
      wordpress.throwCustomError("Failed to fetch comments from WordPress:", error, warnings);
    }

    const comments = response.comments || [];
    const lastCommentId = Number(await db.get("lastCommentId"));

    // First run: Initialize cursor
    if (!lastCommentId) {
      if (!comments.length) {
        console.log("No comments found on first run. Source initialized with no cursor.");
        return;
      }

      const newest = comments[0]?.ID;
      if (!newest) {
        throw new Error("Failed to initialize: The latest comment does not have a valid ID.");
      }

      await db.set("lastCommentId", newest);
      console.log(`Initialized lastCommentId on first run with comment ID ${newest}.`);
      return;
    }

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


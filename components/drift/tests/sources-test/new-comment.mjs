import wordpress from "../../wordpress_com.app.mjs";
import db from "../dev-db.mjs"; // For testing locally
import mockery$ from "../mockery-dollar.mjs"; // For local mock $ object

// TEST (FIX IN PRODUCTION) - mock data
const mockeryData = {
  wordpress,
  site: "testsit38.wordpress.com",
  postId: "", // Optional: Filter by post
  number: 2,
  db,
};

// TEST (FIX IN PRODUCTION) - local runner
const testAction = {
  mockeryData,
  $emit: (a, meta) => console.log("EMIT:", a, meta), // Show emitted event and metadata

  key: "wordpress_com-new-comment",
  name: "New Comment",
  description: "Emit a separate event for each new comment added since the last run. If no new comments, emit nothing.",
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
      type: "number",
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
    } = this.mockeryData; // TEST

    warnings.push(...wordpress.methods.checkDomainOrId(site));

    let response;
    try {
      response = await wordpress.methods.getWordpressComments({ // You’ll create this helper next
        $,
        site,
        postId,
        number,
      });

    } catch (error) {
      wordpress.methods.onAxiosCatch("Failed to fetch comments from WordPress:", error, warnings);
    }

    const comments = response.comments || [];
    const lastCommentId = await db.get("lastCommentId");

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

    // Process comments newer than last run
    let maxCommentIdTracker = lastCommentId;
    const newComments = [];

    for (const comment of comments.reverse()) {
      if (comment.ID > lastCommentId) {
        newComments.push(comment);
        if (comment.ID > maxCommentIdTracker) {
          maxCommentIdTracker = comment.ID;
        }
      }
    }

    // Emit each new comment separately
    for (const comment of newComments) {
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

// TEST (FIX IN PRODUCTION)
async function runTest() {
  await testAction.run(mockery$);
}
runTest();
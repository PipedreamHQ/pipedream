import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-new-post",
  name: "New Post",
  description: "Emit new event for each new post published since the last run. If no new posts, emit nothing.",
  version: "0.0.5",
  type: "source",
  props: {
    wordpress,
    db: "$.service.db",
    site: {
      type: "string",
      label: "Site ID or domain",
      description: "Enter a site ID or domain (e.g. testsit38.wordpress.com). Do not include 'https://' or 'www'.",
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
  },

  async run({ $ }) {

    const warnings = [];

    const {
      wordpress,
      db,
      site,
      type,
      number,
    } = this;

    warnings.push(...wordpress.checkDomainOrId(site));

    let response;
    try {
      response = await wordpress.getWordpressPosts({
        $,
        site,
        type,
        number,
      });

    } catch (error) {
      wordpress.throwCustomError("Failed to fetch posts from WordPress:", error, warnings);
    }

    const posts = (type === "attachment")
      ? (response.media || [])
      : (response.posts || []);
    const lastPostId = Number(await db.get("lastPostId"));

    // First run: Initialize cursor
    if (!lastPostId) {
      if (!posts.length) {
        console.log("No posts found on first run. Source initialized with no cursor.");
        return;
      }

      const newest = posts[0]?.ID;
      if (!newest) {
        throw new Error("Failed to initialize: The latest post does not have a valid ID.");
      }

      await db.set("lastPostId", newest);
      console.log(`Initialized lastPostId on first run with post ID ${newest}.`);
      return;
    }

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

    if (warnings.length > 0) {
      console.log("Warnings:\n- " + warnings.join("\n- "));
    };
  },
};

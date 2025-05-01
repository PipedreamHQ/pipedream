import wordpress from "../../wordpress_com.app.mjs";
import db from "../dev-db.mjs"; // For testing locally
import mockery$ from "../mockery-dollar.mjs"; // For local mock $ object

// TEST (FIX IN PRODUCTION) - your mockery input
const mockeryData = {
  wordpress,
  site: "testsit38.wordpress.com",
  db,
};

// TEST (FIX IN PRODUCTION) - local runner
const testAction = {
  mockeryData,
  $emit: (a, meta) => console.log("EMIT:", a, meta), // Show emitted event and metadata

  key: "wordpress_com-new-follower",
  name: "New Follower",
  description: "Emit a separate event for each new follower that subscribes to the site.",
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
  },

  async run({ $ }) {
    const warnings = [];

    const {
      wordpress,
      db,
      site,
    } = this.mockeryData; // TEST

    warnings.push(...wordpress.methods.checkDomainOrId(site));

    let response;
    try {
      response = await wordpress.methods.getWordpressFollowers({ // You’ll create this helper next
        $,
        site,
      });

    } catch (error) {
      wordpress.methods.onAxiosCatch("Failed to fetch followers from WordPress:", error, warnings);
    }

    const followers = response.subscribers || [];
    //const lastFollowerId = await db.get("lastFollowerId");
    const lastFollowerId = 1;

    // First run: Initialize cursor
    if (!lastFollowerId) {
    if (!followers.length) {
        console.log("No followers found on first run. Source initialized with no cursor.");
        return;
    }

    const newest = followers[0]?.ID;
    if (!newest) {
        throw new Error("Failed to initialize: The latest follower does not have a valid ID.");
    }

    await db.set("lastFollowerId", newest);
    console.log(`Initialized lastFollowerId on first run with follower ID ${newest}.`);
    return;
    }

    // Process followers newer than last run
    let maxFollowerIdTracker = lastFollowerId;
    const newFollowers = [];

    for (const follower of followers) {
    if (follower.ID > lastFollowerId) {
        newFollowers.push(follower);
        if (follower.ID > maxFollowerIdTracker) {
        maxFollowerIdTracker = follower.ID;
        }
    }
    }

    // Emit each new follower separately
    for (const follower of newFollowers) {
    this.$emit(follower, {
        id: follower.ID,
        summary: follower.label || follower.login || "Anonymous Follower",
        ts: follower.date_subscribed && +new Date(follower.date_subscribed),
    });
    }

    // Update last seen follower ID
    if (newFollowers.length > 0) {
    await db.set("lastFollowerId", maxFollowerIdTracker);
    console.log(`Checked for new followers. Emitted ${newFollowers.length} follower(s).`);
    } else {
    console.log("No new followers found.");
    }

    if (warnings.length > 0) {
    console.log("Warnings:\n- " + warnings.join("\n- "));
    }
    },
    };

    // TEST (FIX IN PRODUCTION)
    async function runTest() {
    await testAction.run(mockery$);
    }
runTest();

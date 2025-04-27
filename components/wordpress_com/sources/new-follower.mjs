import wordpress from "../wordpress_com.app.mjs";


export default {
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
    } = this;

    warnings.push(...wordpress.checkDomainOrId(site));

    let response;
    try {
      response = await wordpress.getWordpressFollowers({ 
        $,
        site,
      });

    } catch (error) {
      wordpress.onAxiosCatch("Failed to fetch followers from WordPress:", error, warnings);
    }

    const followers = response.subscribers || [];

    const lastFollowerId = await db.get("lastFollowerId");
  
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


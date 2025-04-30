import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-new-follower",
  name: "New Follower",
  description: "Emit new event for each new follower that subscribes to the site.",
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
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "How often to poll WordPress for new followers.",
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
      wordpress.throwCustomError("Failed to fetch followers from WordPress:", error, warnings);
    }

    const followers = response.subscribers || [];

    const lastFollowerId = Number(await db.get("lastFollowerId"));

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
      if (Number(follower.ID) > lastFollowerId) {
        newFollowers.push(follower);
        if (Number(follower.ID) > maxFollowerIdTracker) {
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


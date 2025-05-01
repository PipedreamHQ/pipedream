import wordpress from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-new-follower",
  name: "New Follower",
  description: "Emit new event for each new follower that subscribes to the site.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    getWordpressFollowers($) {

      return this.wordpress.getWordpressFollowers({
        $,
        site: this.site,
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
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "How often to poll WordPress for new followers.",
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

      await this.db.set("lastFollowerId", null); //reset

      const response = await this.getWordpressFollowers(this.wordpress._mock$);

      const followers = response.subscribers || [];

      await wordpress.initialize(followers, db, "lastFollowerId");
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
      response = await this.getWordpressFollowers($);

    } catch (error) {
      wordpress.throwCustomError("Failed to fetch followers from WordPress:", error, warnings);
    }

    const followers = response.subscribers || [];

    const lastFollowerId = Number(await db.get("lastFollowerId"));

    if (!lastFollowerId) await wordpress.initialize(followers, db, "lastPostId");

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


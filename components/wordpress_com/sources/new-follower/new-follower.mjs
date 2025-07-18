import wordpress from "../../wordpress_com.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "wordpress_com-new-follower",
  name: "New Follower",
  description: "Emit new event for each new follower that subscribes to the site.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    getWordpressFollowers($) {

      return this.wordpress.getWordpressFollowers({
        $,
        site: this.site,
        type: this.type,
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
    type: {
      type: "string",
      label: "Follower Type",
      description: "Select the type of followers to fetch: those who clicked Subscribe or those manually added in the dashboard.",
      options: [
        {
          label: "WordPress.com Followers",
          value: "wpcom",
        },
        {
          label: "Email-only Followers",
          value: "email",
        },
      ],
      default: "wpcom",
    },
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "How often to poll WordPress for new followers.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async activate() {

      const {
        wordpress,
        db,
      } = this;

      await this.db.set("lastFollowerId", null); //reset

      const response = await this.getWordpressFollowers();

      const followers = response.subscribers || [];

      await wordpress.initialize(followers, db, "lastFollowerId");
    },
  },

  async run({ $ }) {
    const {
      wordpress,
      db,
    } = this;

    const response = await this.getWordpressFollowers($);

    const followers = response.subscribers || [];

    const lastFollowerId = Number(await db.get("lastFollowerId"));

    if (!lastFollowerId) await wordpress.initialize(followers, db, "lastFollowerId");

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
  },
};


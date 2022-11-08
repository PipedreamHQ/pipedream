import twitter from "../../twitter.app.mjs";

export default {
  props: {
    db: "$.service.db",
    twitter,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Twitter API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async activate() {
      await this._provisionFollowersCache();
    },
  },
  deactivate() {
    this._clearFollowersCache();
  },
  methods: {
    /**
     * This method returns the size of the internal cache used by the event
     * source to keep track of the latest Twitter followers of the corresponding
     * account.
     *
     * The size represents the maximum amount of entries/ID's that will be
     * cached at any given time (or 0 for unlimited). Keep in mind that the
     * Pipedream platform itself imposes size limits as well in terms of DB
     * usage.
     *
     * @returns The maximum amount of Twitter followers entries to be cached at
     * any given moment (or 0 for unlimited).
     */
    getFollowersCacheSize() {
      return 0;
    },
    getScreenName() {
      // When screen name is not explicitly provided, the Twitter API defaults
      // it to the user making the API request
      return undefined;
    },
    /**
     * This function provides the list of relevant, follower-related, user ID's
     * that are used by the event source to emit events. How each event source
     * that implements it depends on the purpose of the event source itself. For
     * example, an event source that emits an event for every new follower will
     * implement this function in such a way that its result is a list of user
     * ID's for each new follower detected.
     *
     * @returns the list of relevant user ID's for this event source to process
     */
    getRelevantIds() {
      return [];
    },
    generateMeta(data) {
      const {
        timestamp,
        user,
      } = data;
      const {
        id_str: id,
        screen_name: summary,
      } = user;
      // Event timestamp is expressed in seconds, whereas Javascript timestamps
      // are expressed in milliseconds
      const ts = timestamp * 1000;
      return {
        id,
        summary,
        ts,
      };
    },
    _clearFollowersCache() {
      this.setFollowersCache([]);
    },
    async _provisionFollowersCache() {
      const screenName = this.getScreenName();
      const followerIdsGen = this.twitter.scanFollowerIds(screenName);
      const maxFollowerListSize = Math.max(this.getFollowersCacheSize(), 0);
      const result = [];
      for await (const id of followerIdsGen) {
        if (maxFollowerListSize !== 0 && maxFollowerListSize === result.length) {
          break;
        }

        result.push(id);
      }

      this.setFollowersCache(result);
      return result;
    },
    getFollowersCache() {
      return this.db.get("followers");
    },
    setFollowersCache(followers) {
      const followersCacheSize = Math.max(this.getFollowersCacheSize(), 0);
      const trimmedFollowers = followersCacheSize !== 0
        ? followers.slice(0, followersCacheSize)
        : followers;
      this.db.set("followers", trimmedFollowers);
      console.log(`
        Updated followers cache: ${trimmedFollowers.length} records
      `);
    },
    /**
     * This generator method scans the list of Twitter followers until it finds
     * the ID of a follower that was already processed.
     *
     * @param {string[]} processedFollowerIds a list of the ID's of the most
     * recent Twitter followers processed by the event source
     * @yields the ID of a new Twitter follower
     */
    async *scanNewFollowers(processedFollowerIds = []) {
      const processeedFollowerIdsSet = new Set(processedFollowerIds);
      const screenName = this.getScreenName();
      const followerIdsGen = this.twitter.scanFollowerIds(screenName);
      for await (const id of followerIdsGen) {
        if (processeedFollowerIdsSet.has(id)) {
          break;
        }
        yield id;
      }
    },
    async getUnfollowers() {
      const prevFollowers = this.getFollowersCache();
      const currFollowers = await this._provisionFollowersCache();
      const currFollowersSet = new Set(currFollowers);
      return prevFollowers.filter((pf) => !currFollowersSet.has(pf));
    },
  },
  async run(event) {
    const { timestamp } = event;
    const relevantIds = await this.getRelevantIds();
    if (relevantIds.length <= 0) {
      console.log(`
        No changes in followers data for this event source to emit a new event
      `);
      return;
    }

    const users = await this.twitter.lookupUsers({
      userIdArray: relevantIds,
    });
    users.forEach((user) => {
      const data = {
        timestamp,
        user,
      };
      user.profile_url = `https://twitter.com/${user.screen_name}/`;
      const meta = this.generateMeta(data);
      this.$emit(user, meta);
    });
  },
};

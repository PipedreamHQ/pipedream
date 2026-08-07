import {
  GlobalApiKeySettings,
  Lists,
  Profiles,
  Events,
} from "klaviyo-api";

export default {
  type: "app",
  app: "klaviyo",
  propDefinitions: {
    list: {
      type: "string",
      label: "List",
      description: "The list which will be affected",
      withLabel: true,
      async options({ prevContext }) {
        const {
          body: {
            data, links,
          },
        } = await this.getLists({
          pageCursor: prevContext?.nextCursor,
        });

        return {
          options: data.map(({
            id: value, attributes: { name: label },
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: this.getCursorFromNextLink(links?.next),
          },
        };
      },
    },
    profileIds: {
      type: "string[]",
      label: "Profile IDs",
      description: "An array of profile IDs",
      withLabel: true,
      async options({ prevContext }) {
        const {
          body: {
            data, links,
          },
        } = await this.listProfiles({
          pageCursor: prevContext?.nextCursor,
        });

        return {
          options: data.map(({
            id: value, attributes: { email: label },
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: this.getCursorFromNextLink(links?.next),
          },
        };
      },
    },
    listName: {
      type: "string",
      label: "List Name",
      description: "The name of the new list",
    },
  },
  methods: {
    sdk() {
      new GlobalApiKeySettings(this.$auth.api_key);
    },
    newList(data) {
      this.sdk();
      return Lists.createList(data);
    },
    getLists(opts = {}) {
      this.sdk();
      return Lists.getLists(opts);
    },
    subscribeProfiles({
      listId, ...opts
    }) {
      this.sdk();
      return Lists.createListRelationships(listId, opts);
    },
    listProfiles(opts = {}) {
      this.sdk();
      return Profiles.getProfiles(opts);
    },
    createOrUpdateProfile(data) {
      this.sdk();
      return Profiles.createProfile(data);
    },
    createEvent(data) {
      this.sdk();
      return Events.createEvent(data);
    },
    getCursorFromNextLink(url) {
      if (!url) {
        return;
      }
      return (new URL(url)).searchParams.get("page[cursor]");
    },
    async *paginate({
      fn, opts = {}, max,
    }) {
      let hasMore, count = 0;
      do {
        const {
          body: {
            data, links,
          },
        } = await fn(opts);
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        opts.pageCursor = this.getCursorFromNextLink(links?.next);
        hasMore = links?.next;
      } while (hasMore);
    },
  },
};

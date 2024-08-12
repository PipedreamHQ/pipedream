import {
  GlobalApiKeySettings, Lists,
  Profiles,
} from "klaviyo-api";

export default {
  type: "app",
  app: "klaviyo",
  propDefinitions: {
    list: {
      type: "string",
      label: "List",
      description: "The list which will be affected.",
      withLabel: true,
      async options() {
        const { body: { data } } = await this.getLists();

        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    profileIds: {
      type: "string[]",
      label: "Profile Ids",
      description: "An array with profile Ids.",
      withLabel: true,
      async options({ prevContext }) {
        const {
          body: {
            data, links,
          },
        } = await this.listProfiles({
          "page[cursor]": prevContext.nextCursor,
        });

        return {
          options: data.map(({
            id: value, attributes: { email: label },
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: links.next,
          },
        };
      },
    },
    listName: {
      type: "string",
      label: "List Name",
      description: "The name of the new list.",
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
    getLists() {
      this.sdk();
      return Lists.getLists();
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
  },
};

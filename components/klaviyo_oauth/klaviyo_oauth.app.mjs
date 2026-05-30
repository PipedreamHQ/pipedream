import common from "@pipedream/klaviyo";
import {
  OAuthBasicSession,
  ProfilesApi,
  EventsApi,
  ListsApi,
} from "klaviyo-api";

export default {
  ...common,
  app: "klaviyo_oauth",
  methods: {
    ...common.methods,
    getSession() {
      return new OAuthBasicSession(this.$auth.oauth_access_token);
    },
    createOrUpdateProfile(data) {
      const session = this.getSession();
      const profilesApi = new ProfilesApi(session);
      return profilesApi.createProfile(data);
    },
    createEvent(data) {
      const session = this.getSession();
      const eventsApi = new EventsApi(session);
      return eventsApi.createEvent(data);
    },
    listProfiles(opts = {}) {
      const session = this.getSession();
      const profilesApi = new ProfilesApi(session);
      return profilesApi.getProfiles(opts);
    },
    subscribeProfiles({
      listId, ...opts
    } = {}) {
      const session = this.getSession();
      const listsApi = new ListsApi(session);
      return listsApi.createListRelationships(listId, opts);
    },
    getLists(opts = {}) {
      const session = this.getSession();
      const listsApi = new ListsApi(session);
      return listsApi.getLists(opts);
    },
    newList(data) {
      const session = this.getSession();
      const listsApi = new ListsApi(session);
      return listsApi.createList(data);
    },
  },
};

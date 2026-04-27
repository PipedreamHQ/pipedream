import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fellow",
  propDefinitions: {
    noteId: {
      type: "string",
      label: "Note ID",
      description: "The ID of the note",
      async options({ prevContext }) {
        const { notes } = await this.listNotes({
          data: {
            pagination: {
              cursor: prevContext?.cursor,
            },
          },
        });
        return {
          options: notes?.data?.map((note) => ({
            label: note.title,
            value: note.id,
          })) || [],
          context: {
            cursor: notes?.page_info?.cursor,
          },
        };
      },
    },
    actionItemId: {
      type: "string",
      label: "Action Item ID",
      description: "The ID of the action item",
      async options({ prevContext }) {
        const { actionItems } = await this.listActionItems({
          data: {
            pagination: {
              cursor: prevContext?.cursor,
            },
          },
        });
        return {
          options: actionItems?.data?.map((actionItem) => ({
            label: actionItem.text,
            value: actionItem.id,
          })) || [],
          context: {
            cursor: actionItems?.page_info?.cursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.fellow.app/api/v1`;
    },
    _makeRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          "x-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    getNote({
      noteId, ...opts
    }) {
      return this._makeRequest({
        url: `/note/${noteId}`,
        ...opts,
      });
    },
    listNotes({ ...opts } = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/notes",
        ...opts,
      });
    },
    listActionItems({ ...opts } = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/action_items",
        ...opts,
      });
    },
    completeActionItem({
      actionItemId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/action_item/${actionItemId}/complete`,
        ...opts,
      });
    },
    archiveActionItem({
      actionItemId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/action_item/${actionItemId}/archive`,
        ...opts,
      });
    },
  },
};

import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "lark",
  propDefinitions: {
    folderToken: {
      type: "string",
      label: "Folder Token",
      description: "The token of the parent folder",
      async options() {
        const { data: { token: rootToken } } = await this.getRootFolder();

        const response = [
          {
            label: "Root",
            value: rootToken,
          },
        ];

        response.push(...await this.serealizeFolderTree({
          token: rootToken,
        }));
        return response;
      },
    },
    calendarId: {
      type: "string",
      label: "Calendar ID",
      description: "The ID of the calendar to create the event in.",
      async options({ prevContext }) {
        const { data } = await this.listCalendars({
          params: {
            page_token: prevContext?.page_token,
          },
        });
        return {
          options: data.calendar_list.map(({
            calendar_id: value, summary: label,
          }) => ({
            label,
            value,
          })),
          context: {
            page_token: data.page_token,
          },
        };
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table to create the record in.",
      async options({
        prevContext, baseToken,
      }) {
        const { data } = await this.listTables({
          baseToken,
          params: {
            page_token: prevContext?.page_token,
          },
        });
        return {
          options: data.items.map(({
            table_id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            page_token: data.page_token,
          },
        };
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update.",
      async options({
        prevContext, baseToken, tableId,
      }) {
        const { data } = await this.listRecords({
          baseToken,
          tableId,
          params: {
            page_token: prevContext?.page_token,
          },
        });
        return {
          options: data.items.map(({ record_id }) => record_id),
          context: {
            page_token: data.page_token,
          },
        };
      },
    },
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "The ID of the Lark chat",
      async options({ prevContext }) {
        const { data } = await this.listGroupChats({
          params: {
            page_token: prevContext?.page_token,
          },
        });
        return {
          options: data.items.map(({
            chat_id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            page_token: data.page_token,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to add to the group chat",
      async options({ prevContext }) {
        const { data } = await this.listUsers({
          params: {
            page_token: prevContext?.page_token,
          },
        });
        return {
          options: data.items.map(({
            user_id: value, name, email,
          }) => ({
            label: `${name} (${email})`,
            value,
          })),
          context: {
            page_token: data.page_token,
          },
        };
      },
    },
    baseToken: {
      type: "string",
      label: "Base Token",
      description: "The token for the base to create the record in. [See the documentation](https://open.larksuite.com/document/server-docs/docs/bitable-v1/notification#dcf71789) to check how to get the Base Token.",
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "The fields to create the record with.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://open.larksuite.com/open-apis";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    async serealizeFolderTree({
      token, pageToken, parentName = "",
    }) {
      const response = [];
      let hasMore = true;

      while (hasMore) {
        const { data } = await this.listFolders({
          params: {
            page_size: LIMIT,
            page_token: pageToken,
            folder_token: token,
          },
        });

        await Promise.all(data.files
          .filter(({ type }) => type === "folder")
          .sort((a, b) => a.created_time - b.created_time)
          .map(async ({
            token: value, name: label,
          }) => {
            response.push({
              label: `${parentName}${parentName
                ? " / "
                : ""}${label}`,
              value,
            });
            response.push(...await this.serealizeFolderTree({
              token: value,
              pageToken: data.next_page_token,
              parentName: `${parentName}${parentName
                ? " / "
                : ""}${label}`,
            }));
          }));
        hasMore = data.has_more;
      }
      return response;
    },
    getRootFolder(opts = {}) {
      return this._makeRequest({
        path: "/drive/explorer/v2/root_folder/meta",
        ...opts,
      });
    },
    listFolders(opts = {}) {
      return this._makeRequest({
        path: "/drive/v1/files",
        ...opts,
      });
    },
    createDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/docx/v1/documents",
        ...opts,
      });
    },
    listCalendars(opts = {}) {
      return this._makeRequest({
        path: "/calendar/v4/calendars",
        ...opts,
      });
    },
    listTables({
      baseToken, ...opts
    }) {
      return this._makeRequest({
        path: `/bitable/v1/apps/${baseToken}/tables`,
        ...opts,
      });
    },
    listRecords({
      baseToken, tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/bitable/v1/apps/${baseToken}/tables/${tableId}/records`,
        ...opts,
      });
    },
    createRecord({
      baseToken, tableId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bitable/v1/apps/${baseToken}/tables/${tableId}/records`,
        ...opts,
      });
    },
    updateRecord({
      baseToken, tableId, recordId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/bitable/v1/apps/${baseToken}/tables/${tableId}/records/${recordId}`,
        ...opts,
      });
    },
    createSpreadsheet(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sheets/v3/spreadsheets",
        ...opts,
      });
    },
    listGroupChats(opts = {}) {
      return this._makeRequest({
        path: "/im/v1/chats",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/contact/v3/users",
        ...opts,
      });
    },
    addUserToGroupChat({
      chatId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/im/v1/chats/${chatId}/members`,
        ...opts,
      });
    },
    listChatMembers({
      chatId, ...opts
    }) {
      return this._makeRequest({
        path: `/im/v1/chats/${chatId}/members`,
        ...opts,
      });
    },
    createFolder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/drive/v1/files/create_folder",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/task/v2/tasks",
        ...opts,
      });
    },
    createCalendarEvent({
      calendarId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/calendar/v4/calendars/${calendarId}/events`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, ...opts
    }) {
      let hasMore = false;
      let nextPageToken = null;

      do {
        params.page_token = nextPageToken;
        const {
          data: {
            has_more,
            items,
            page_token,
          },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;
        }

        nextPageToken = page_token;
        hasMore = has_more;

      } while (hasMore);
    },
  },
};

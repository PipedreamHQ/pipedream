import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zendesk",
  propDefinitions: {
    categoryId: {
      type: "string",
      label: "Trigger Category ID",
      description: "The ID of the trigger category. [See the docs here](https://developer.zendesk.com/api-reference/ticketing/business-rules/trigger_categories/#list-trigger-categories)",
      optional: true,
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          trigger_categories: categories,
          meta,
        } =
          await this.listTriggerCategories({
            params: {
              [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
              sort: constants.SORT_BY_POSITION_ASC,
              [constants.PAGE_AFTER_PARAM]: afterCursor,
            },
          });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: categories.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
        };
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket.",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          tickets,
          meta,
        } =
          await this.listTickets({
            params: {
              [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
              sort: constants.SORT_BY_UPDATED_AT_DESC,
              [constants.PAGE_AFTER_PARAM]: afterCursor,
            },
          });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: tickets.map(({
            id, subject,
          }) => ({
            label: subject || `Ticket #${id}`,
            value: id,
          })),
        };
      },
    },
    viewId: {
      type: "string",
      label: "View ID",
      description: "The ID of the view",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          views,
          meta,
        } =
          await this.listViews({
            params: {
              [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
              [constants.PAGE_AFTER_PARAM]: afterCursor,
            },
          });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: views.map(({
            id, title,
          }) => ({
            label: title || `View #${id}`,
            value: id,
          })),
        };
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Ticket fields to be included in the incoming webhook payload",
      withLabel: true,
      optional: true,
      async options() {
        // placehoders reference - https://support.zendesk.com/hc/en-us/articles/4408886858138
        const { ticket_fields: customFields } = await this.listTicketFields();
        const fields = customFields.reverse().map(({
          id, title,
        }) => ({
          label: title,
          value: `{{ticket.ticket_field_${id}}}`,
        }));
        fields.push(...constants.TICKET_FIELD_OPTIONS);
        return fields;
      },
    },
    ticketCommentBody: {
      type: "string",
      label: "Comment body",
      description: "The body of the comment.",
    },
    ticketCommentBodyIsHTML: {
      type: "boolean",
      label: "Comment body is HTML",
      description: "Whether the comment body is HTML. Default is `false`, which expects Markdown",
      default: false,
      optional: true,
    },
    ticketPriority: {
      type: "string",
      label: "Ticket Priority",
      description: "The priority of the ticket.",
      optional: true,
      options: Object.values(constants.TICKET_PRIORITY_OPTIONS),
    },
    ticketSubject: {
      type: "string",
      label: "Ticket Subject",
      description: "The subject of the ticket.",
      optional: true,
    },
    ticketStatus: {
      type: "string",
      label: "Ticket Status",
      description: "The status of the ticket.",
      optional: true,
      options: Object.values(constants.TICKET_STATUS_OPTIONS),
    },
    ticketCommentPublic: {
      type: "boolean",
      label: "Comment Public",
      description: "Whether the comment is public. Default is `true`",
      default: true,
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort tickets by",
      optional: true,
      options: constants.SORT_BY_OPTIONS,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort order (ascending or descending)",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of tickets to return",
      optional: true,
      default: 100,
    },
    customSubdomain: {
      type: "string",
      label: "Custom Subdomain",
      description: "For Enterprise Zendesk accounts: optionally specify the subdomain to use. This will override the subdomain that was provided when connecting your Zendesk account to Pipedream. For example, if you Zendesk URL is https://examplehelp.zendesk.com, your subdomain is `examplehelp`",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "File paths or URLs to attach to the ticket. Multiple files can be attached.",
      optional: true,
    },
  },
  methods: {
    getUrl(path, customSubdomain) {
      const {
        SUBDOMAIN_PLACEHOLDER,
        BASE_URL,
        VERSION_PATH,
      } = constants;
      const baseUrl = BASE_URL.replace(
        SUBDOMAIN_PLACEHOLDER,
        customSubdomain?.trim() || this.$auth.subdomain,
      );
      return `${baseUrl}${VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, url, path, headers, customSubdomain, ...args
    }) {
      const config = {
        headers: this.getHeaders(headers),
        url: url ?? this.getUrl(path, customSubdomain),
        timeout: constants.DEFAULT_TIMEOUT,
        ...args,
      };
      return axios(step, config);
    },
    getTicketInfo({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
    searchTickets(args = {}) {
      return this.makeRequest({
        path: "/search",
        ...args,
      });
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    listTriggerCategories(args = {}) {
      return this.makeRequest({
        path: "/trigger_categories",
        ...args,
      });
    },
    listTickets(args = {}) {
      return this.makeRequest({
        path: "/tickets",
        ...args,
      });
    },
    listViews(args = {}) {
      return this.makeRequest({
        path: "/views",
        ...args,
      });
    },
    listTicketsInView({
      viewId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/views/${viewId}/tickets`,
        ...args,
      });
    },
    listTicketFields(args = {}) {
      return this.makeRequest({
        path: "/ticket_fields",
        ...args,
      });
    },
    /**
     * Upload a single file (local path or http(s) URL) to Zendesk Uploads API.
     * @param {Object} params
     * @param {string} params.filePath - Local filesystem path or http(s) URL.
     * @param {string} [params.filename] - Optional filename override for the upload.
     * @param {string} [params.customSubdomain]
     * @param {*} [params.step]
     */
    async uploadFile({
      filePath, filename, customSubdomain, step,
    } = {}) {
      if (!filePath || typeof filePath !== "string") {
        throw new Error("uploadFile: 'filePath' (string) is required");
      }
      const fs = await import("fs");
      const path = await import("path");

      const contentTypeMap = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".txt": "text/plain",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".zip": "application/zip",
      };

      let fileContent;
      let contentType;

      const isHttp = /^https?:\/\//i.test(filePath);
      if (isHttp) {
        // Fetch remote file as arraybuffer to preserve bytes
        const res = await axios(step, {
          method: "get",
          url: filePath,
          responseType: "arraybuffer",
          returnFullResponse: true,
          timeout: 60_000,
        });
        fileContent = res.data;

        const headerCT = res.headers?.["content-type"];
        const cd = res.headers?.["content-disposition"];

        if (!filename) {
          const cdMatch = cd?.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
          filename = cdMatch?.[1]
            ? decodeURIComponent(cdMatch[1].replace(/(^"|"$)/g, ""))
            : (() => {
                try {
                  return path.basename(new URL(filePath).pathname);
                } catch {
                  return "attachment";
                }
              })();
        }
        const ext = path.extname(filename || "").toLowerCase();
        contentType = headerCT || contentTypeMap[ext] || "application/octet-stream";
      } else {
        // Local file: non-blocking read
        if (!filename) {
          filename = path.basename(filePath);
        }
        fileContent = await fs.promises.readFile(filePath);
        const ext = path.extname(filename || "").toLowerCase();
        contentType = contentTypeMap[ext] || "application/octet-stream";
      }

      return this.makeRequest({
        step,
        method: "post",
        path: `/uploads?filename=${encodeURIComponent(filename)}`,
        customSubdomain,
        headers: {
          "Content-Type": contentType,
        },
        data: fileContent,
      });
    },
    async uploadFiles({
      attachments, customSubdomain, step,
    } = {}) {
      if (!attachments || !attachments.length) {
        return [];
      }
      const files = attachments
        .map((a) => (typeof a === "string" ? a.trim() : a))
        .filter(Boolean);

      const settled = await Promise.allSettled(
        files.map((attachment) =>
          this.uploadFile({ filePath: attachment, customSubdomain, step }),
        ),
      );

      const tokens = [];
      const errors = [];
      settled.forEach((res, i) => {
        const attachment = files[i];
        if (res.status === "fulfilled") {
          const token = res.value?.upload?.token;
          if (!token) {
            errors.push(`Upload API returned no token for ${attachment}`);
          } else {
            tokens.push(token);
          }
        } else {
          const reason = res.reason?.message || String(res.reason || "Unknown error");
          errors.push(`${attachment}: ${reason}`);
        }
      });

      if (errors.length) {
        throw new Error(`Failed to upload ${errors.length}/${files.length} attachment(s): ${errors.join("; ")}`);
      }
      return tokens;
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          per_page: constants.DEFAULT_LIMIT,
          page: 1,
        },
      };
      let hasMore = true;
      let count = 0;
      while (hasMore) {
        const response = await fn(args);
        const items = resourceKey
          ? response[resourceKey]
          : response;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = !!response.next_page;
        args.params.page += 1;
      }
    },
  },
};

import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
import path from "path";
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
              active: true,
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
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          users,
          meta,
        } = await this.listUsers({
          params: {
            [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
            [constants.PAGE_AFTER_PARAM]: afterCursor,
          },
        });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: users.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
        };
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      optional: true,
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          groups,
          meta,
        } = await this.listGroups({
          params: {
            [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
            [constants.PAGE_AFTER_PARAM]: afterCursor,
          },
        });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: groups.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
        };
      },
    },
    macroCategory: {
      type: "string",
      label: "Macro Category",
      description: "The category of the macro",
      optional: true,
      async options() {
        const { categories } = await this.listMacroCategories();
        return categories.map((category) => category);
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
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale of the article",
      async options() {
        const { locales } = await this.listLocales();
        return locales.map((locale) => locale.locale);
      },
    },
    articleCategoryId: {
      type: "string",
      label: "Article Category ID",
      description: "The ID of the article category",
      async options({
        locale, prevContext,
      }) {
        const { afterCursor } = prevContext;
        const {
          categories, meta,
        } = await this.listArticleCategories({
          locale,
          params: {
            [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
            [constants.PAGE_AFTER_PARAM]: afterCursor,
          },
        });
        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: categories.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
    sectionId: {
      type: "string",
      label: "Section ID",
      description: "The ID of the section",
      async options({
        locale, categoryId, prevContext,
      }) {
        const { afterCursor } = prevContext;
        const {
          sections, meta,
        } = await this.listSections({
          locale,
          categoryId,
          params: {
            [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
            [constants.PAGE_AFTER_PARAM]: afterCursor,
          },
        });
        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: sections.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID of the article. You can use the List Articles action to get the ID of the article.",
      async options({
        locale, prevContext,
      }) {
        const { afterCursor } = prevContext;
        const {
          articles, meta,
        } = await this.listArticles({
          locale,
          params: {
            [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
            [constants.PAGE_AFTER_PARAM]: afterCursor,
          },
        });
        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: articles.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })),
        };
      },
    },
    macroId: {
      type: "string",
      label: "Macro ID",
      description: "The ID of the macro",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;
        const {
          macros, meta,
        } = await this.listMacros({
          params: {
            [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
            [constants.PAGE_AFTER_PARAM]: afterCursor,
          },
        });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: macros.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })),
        };
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
    ticketTags: {
      type: "string[]",
      label: "Tags",
      description: "Array of tags to apply to the ticket. These will replace any existing tags on the ticket.",
      optional: true,
    },
    assigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "The ID of the agent to assign the ticket to",
      optional: true,
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          users,
          meta,
        } = await this.listUsers({
          params: {
            [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
            [constants.PAGE_AFTER_PARAM]: afterCursor,
            role: "agent",
          },
        });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: users.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
        };
      },
    },
    assigneeEmail: {
      type: "string",
      label: "Assignee Email",
      description: "The email address of the agent to assign the ticket to",
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
      step = this, url, path, locale = "", headers, customSubdomain, ...args
    }) {
      return axios(step, {
        headers: this.getHeaders(headers),
        url: url ?? this.getUrl(`${locale
          ? locale
          : ""}${path}`, customSubdomain),
        timeout: constants.DEFAULT_TIMEOUT,
        ...args,
      });
    },
    getTicketInfo({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
    getUserInfo({
      userId, ...args
    }) {
      return this.makeRequest({
        path: `/users/${userId}`,
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
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
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
    }) {
      if (!filePath || typeof filePath !== "string") {
        throw new Error("uploadFile: 'filePath' (string) is required");
      }

      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(filePath);
      const fileBinary = await this.streamToBuffer(stream);

      if (!filename) {
        filename = path.basename(filePath);
      }

      return this.makeRequest({
        step,
        method: "post",
        path: `/uploads?filename=${encodeURIComponent(filename)}`,
        customSubdomain,
        headers: {
          "Content-Type": metadata.contentType,
          "Content-Length": metadata.size,
          "Accept": "application/json",
        },
        data: Buffer.from(fileBinary, "binary"),
      });
    },
    async uploadFiles({
      attachments, customSubdomain, step,
    } = {}) {
      if (!attachments || !attachments.length) {
        return [];
      }
      const files = attachments
        .map((a) => (typeof a === "string"
          ? a.trim()
          : a))
        .filter(Boolean);

      const settled = await Promise.allSettled(
        files.map((attachment) =>
          this.uploadFile({
            filePath: attachment,
            customSubdomain,
            step,
          })),
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
    listTicketComments({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tickets/${ticketId}/comments`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this.makeRequest({
        path: "/users",
        ...args,
      });
    },
    listLocales(args = {}) {
      return this.makeRequest({
        path: "/locales",
        ...args,
      });
    },
    listMacros(args = {}) {
      return this.makeRequest({
        path: "/macros",
        ...args,
      });
    },
    listActiveMacros(args = {}) {
      return this.makeRequest({
        path: "/macros/active",
        ...args,
      });
    },
    listMacroCategories(args = {}) {
      return this.makeRequest({
        path: "/macros/categories",
        ...args,
      });
    },
    listGroups(args = {}) {
      return this.makeRequest({
        path: "/groups",
        ...args,
      });
    },
    prepareLocalePath({
      locale = null, path,
    }) {
      return `/help_center${locale
        ? `/${locale}`
        : ""}${path}`;
    },
    listArticleCategories({
      locale, ...args
    } = {}) {
      return this.makeRequest({
        path: this.prepareLocalePath({
          locale,
          path: "/categories",
        }),
        ...args,
      });
    },
    listSections({
      locale, categoryId, ...args
    } = {}) {
      return this.makeRequest({
        path: this.prepareLocalePath({
          locale,
          path: `/${categoryId
            ? `/categories/${categoryId}`
            : ""}/sections`,
        }),
        ...args,
      });
    },
    listArticles({
      locale, categoryId, sectionId, userId, ...args
    } = {}) {
      let path = "";
      if (categoryId) {
        path = `/categories/${categoryId}`;
      }
      if (sectionId) {
        path = `/sections/${sectionId}`;
      }
      if (userId) {
        path = `/users/${userId}`;
      }

      return this.makeRequest({
        path: this.prepareLocalePath({
          locale,
          path: `${path}/articles`,
        }),
        ...args,
      });
    },
    getArticle({
      articleId, locale, ...args
    } = {}) {
      return this.makeRequest({
        path: this.prepareLocalePath({
          helpCenter: true,
          locale,
          path: `/articles/${articleId}`,
        }),
        ...args,
      });
    },
    getMacro({
      macroId, ...args
    }) {
      return this.makeRequest({
        path: `/macros/${macroId}`,
        ...args,
      });
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
    /**
     * Set tags on a ticket (replaces all existing tags)
     * @param {object} args - Arguments object
     * @param {string} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to set
     * @param {string} args.customSubdomain - Optional custom subdomain
     * @returns {Promise<object>} API response
     */
    setTicketTags({
      ticketId, tags, customSubdomain, ...args
    }) {
      return this.makeRequest({
        method: "POST",
        path: `/tickets/${ticketId}/tags.json`,
        customSubdomain,
        data: {
          tags,
        },
        ...args,
      });
    },
    /**
     * Add tags to a ticket (appends to existing tags)
     * @param {object} args - Arguments object
     * @param {string} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to add
     * @param {string} args.customSubdomain - Optional custom subdomain
     * @returns {Promise<object>} API response
     */
    addTicketTags({
      ticketId, tags, customSubdomain, ...args
    }) {
      return this.makeRequest({
        method: "PUT",
        path: `/tickets/${ticketId}/tags.json`,
        customSubdomain,
        data: {
          tags,
        },
        ...args,
      });
    },
    /**
     * Remove specific tags from a ticket
     * @param {object} args - Arguments object
     * @param {string} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to remove
     * @param {string} args.customSubdomain - Optional custom subdomain
     * @returns {Promise<object>} API response
     */
    removeTicketTags({
      ticketId, tags, customSubdomain, ...args
    }) {
      return this.makeRequest({
        method: "DELETE",
        path: `/tickets/${ticketId}/tags.json`,
        customSubdomain,
        data: {
          tags,
        },
        ...args,
      });
    },
  },
};

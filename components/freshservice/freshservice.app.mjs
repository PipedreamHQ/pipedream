import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "freshservice",
  propDefinitions: {
    solutionCategoryId: {
      type: "string",
      label: "Solution Category ID",
      description: "The ID of a solution category",
      async options() {
        const { categories } = await this.listSolutionCategories();
        return categories.map((category) => ({
          label: category.name,
          value: category.id,
        }));
      },
    },
    solutionFolderId: {
      type: "string",
      label: "Solution Folder ID",
      description: "The ID of a solution folder",
      async options({ solutionCategoryId }) {
        const { folders } = await this.listSolutionFolders({
          params: {
            category_id: solutionCategoryId,
          },
        });
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
    },
    solutionArticleId: {
      type: "string",
      label: "Solution Article ID",
      description: "The ID of a solution article",
      async options({ solutionFolderId }) {
        const { articles } = await this.listSolutionArticles({
          params: {
            folder_id: solutionFolderId,
          },
        });
        return articles.map((article) => ({
          label: article.title,
          value: article.id,
        }));
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of a ticket",
      async options({ page }) {
        const { tickets } = await this.listTickets({
          params: {
            page: page + 1,
          },
        });
        return tickets.map((ticket) => ({
          label: ticket.subject,
          value: ticket.id,
        }));
      },
    },
    ticketSourceType: {
      type: "integer",
      label: "Ticket Source Type",
      description: "The source type of a ticket",
      options: constants.TICKET_SOURCE_TYPES,
    },
    ticketStatus: {
      type: "integer",
      label: "Ticket Status",
      description: "The status of a ticket",
      options: constants.TICKET_STATUS,
    },
    ticketPriority: {
      type: "integer",
      label: "Ticket Priority",
      description: "The priority of a ticket",
      options: constants.TICKET_PRIORITIES,
    },
    solutionArticleType: {
      type: "integer",
      label: "Solution Article Type",
      description: "The type of a solution article",
      options: constants.SOLUTION_ARTICLE_TYPES,
    },
    solutionArticleStatus: {
      type: "integer",
      label: "Solution Article Status",
      description: "The status of a solution article",
      options: constants.SOLUTION_ARTICLE_STATUS,
    },
  },
  methods: {
    _domain() {
      return this.$auth.domain;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return `https://${this._domain()}.freshservice.com/api/v2`;
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKey(),
          password: "X",
        },
        ...args,
      });
    },
    getTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
    getSolutionArticle({
      articleId, ...args
    }) {
      return this._makeRequest({
        path: `/solutions/articles/${articleId}`,
        ...args,
      });
    },
    listTickets(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        ...args,
      });
    },
    listSolutionCategories(args = {}) {
      return this._makeRequest({
        path: "/solutions/categories",
        ...args,
      });
    },
    listSolutionFolders(args = {}) {
      return this._makeRequest({
        path: "/solutions/folders",
        ...args,
      });
    },
    listSolutionArticles(args = {}) {
      return this._makeRequest({
        path: "/solutions/articles",
        ...args,
      });
    },
    createTicket(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        method: "POST",
        ...args,
      });
    },
    createSolutionArticle(args = {}) {
      return this._makeRequest({
        path: "/solutions/articles",
        method: "POST",
        ...args,
      });
    },
    updateTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `/tickets/${ticketId}`,
        method: "PUT",
        ...args,
      });
    },
    updateSolutionArticle({
      articleId, ...args
    }) {
      return this._makeRequest({
        path: `/solutions/articles/${articleId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteSolutionArticle({
      articleId, ...args
    }) {
      return this._makeRequest({
        path: `/solutions/articles/${articleId}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};

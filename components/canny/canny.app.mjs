import { axios } from "@pipedream/platform";
const DEFAULT_PAGE_SIZE = 50;

export default {
  type: "app",
  app: "canny",
  propDefinitions: {
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of a board",
      async options() {
        const { boards } = await this.listBoards();
        return boards?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of a post",
      async options({
        page, boardId,
      }) {
        const { posts } = await this.listPosts({
          data: {
            limit: DEFAULT_PAGE_SIZE,
            skip: page * DEFAULT_PAGE_SIZE,
            boardID: boardId,
          },
        });
        return posts?.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of a user",
      async options() {
        const users = await this.listUsers();
        return users?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of a company",
      async options({ prevContext }) {
        const {
          companies, cursor,
        } = await this.listCompanies({
          data: {
            limit: DEFAULT_PAGE_SIZE,
            cursor: prevContext?.cursor,
          },
        });
        const options = companies?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
        return {
          options,
          context: {
            cursor,
          },
        };
      },
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of a tag",
      async options({ page }) {
        const { tags } = await this.listTags({
          data: {
            limit: DEFAULT_PAGE_SIZE,
            skip: page * DEFAULT_PAGE_SIZE,
          },
        });
        return tags?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of a category",
      async options({ page }) {
        const { categories } = await this.listCategories({
          data: {
            limit: DEFAULT_PAGE_SIZE,
            skip: page * DEFAULT_PAGE_SIZE,
          },
        });
        return categories?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of a comment",
      async options({ page }) {
        const { comments } = await this.listComments({
          data: {
            limit: DEFAULT_PAGE_SIZE,
            skip: page * DEFAULT_PAGE_SIZE,
          },
        });
        return comments?.map(({
          id: value, value: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://canny.io/api/v1";
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        ...opts,
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        data: {
          ...data,
          apiKey: `${this.$auth.api_key}`,
        },
      });
    },
    getPost(opts = {}) {
      return this._makeRequest({
        path: "/posts/retrieve",
        ...opts,
      });
    },
    listBoards(opts = {}) {
      return this._makeRequest({
        path: "/boards/list",
        ...opts,
      });
    },
    listPosts(opts = {}) {
      return this._makeRequest({
        path: "/posts/list",
        ...opts,
      });
    },
    listComments(opts = {}) {
      return this._makeRequest({
        path: "/comments/list",
        ...opts,
      });
    },
    listVotes(opts = {}) {
      return this._makeRequest({
        path: "/votes/list",
        ...opts,
      });
    },
    listStatusChanges(opts = {}) {
      return this._makeRequest({
        path: "/status_changes/list",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users/list",
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies/list",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags/list",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/categories/list",
        ...opts,
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        path: "/posts/create",
        ...opts,
      });
    },
    createComment(opts = {}) {
      return this._makeRequest({
        path: "/comments/create",
        ...opts,
      });
    },
    updatePostStatus(opts = {}) {
      return this._makeRequest({
        path: "/posts/change_status",
        ...opts,
      });
    },
  },
};

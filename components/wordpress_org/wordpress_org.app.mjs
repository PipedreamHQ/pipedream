import WPAPI from "wpapi";
import constants from "./common/constants.mjs";
const PER_PAGE = 100;

export default {
  type: "app",
  app: "wordpress_org",
  propDefinitions: {
    search: {
      type: "string",
      label: "Search Query",
      description: "Limit results to those matching a string",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the post",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the post",
    },
    excerpt: {
      type: "string",
      label: "Excerpt",
      description: "The excerpt of the post",
      optional: true,
    },
    commentStatus: {
      type: "boolean",
      label: "Comment Status",
      description: "Whether or not comments are allowed on the post",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Login name for the user",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Display name for the user",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name for the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name for the user",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "  The email address for the user",
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the user",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the user",
      optional: true,
    },
    roles: {
      type: "string",
      label: "Roles",
      description: "Roles assigned to the user",
      optional: true,
      options: constants.ROLES,
    },
    password: {
      type: "string",
      label: "Password",
      description: "  Password for the user",
    },
    author: {
      type: "string",
      label: "Author",
      description: "Limit result set to posts assigned to a specific author",
      optional: true,
      async options({ page }) {
        const authors = await this.getAuthors(page + 1);
        return authors.map((author) => ({
          label: author?.name,
          value: author?.id,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the post",
      optional: true,
      async options() {
        const statuses = await this.listStatuses();
        return Object.keys(statuses).map((key) => ({
          label: statuses[key]?.name,
          value: statuses[key]?.slug,
        }));
      },
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "Categories assigned to the post",
      optional: true,
      async options({ page }) {
        const categories = await this.listCategories(page + 1);
        return categories.map((category) => ({
          label: category?.name,
          value: category?.id,
        }));
      },
    },
    post: {
      type: "string",
      label: "Post",
      description: "The post to update",
      async options({ page }) {
        const posts = await this.listPosts(page + 1);
        return posts.map((post) => ({
          label: post?.title?.rendered,
          value: post?.id,
        }));
      },
    },
  },
  methods: {
    async getClient() {
      const {
        url,
        username,
        application_password: applicationPassword,
      } = this.$auth;
      let site;
      try {
        site = await WPAPI.discover(`https://${url}`);
      } catch {
        site = await WPAPI.discover(`http://${url}`);
      }
      return site.auth({
        username,
        password: applicationPassword,
      });
    },
    async getAuthors(page) {
      const wp = await this.getClient();
      return wp.users().param("who", "authors")
        .perPage(PER_PAGE)
        .page(page);
    },
    async listStatuses() {
      const wp = await this.getClient();
      return wp.statuses();
    },
    async listCategories(page) {
      const wp = await this.getClient();
      return wp.categories().perPage(PER_PAGE)
        .page(page);
    },
    async listPosts(page) {
      const wp = await this.getClient();
      return wp.posts().perPage(PER_PAGE)
        .page(page);
    },
    async searchPosts(params, page, perPage = PER_PAGE) {
      const {
        search,
        author,
        authorExclude,
        statuses,
      } = params;
      const wp = await this.getClient();
      return wp.posts()
        .param("search", search)
        .param("author", author)
        .param("author_exclude", authorExclude)
        .param("status", statuses)
        .perPage(perPage)
        .page(page);
    },
    async createPost(params) {
      const wp = await this.getClient();
      return wp.posts().create(params);
    },
    async updatePost(id, params) {
      const wp = await this.getClient();
      return wp.posts().id(id)
        .update(params);
    },
    async createUser(params) {
      const wp = await this.getClient();
      return wp.users().create(params);
    },
  },
};

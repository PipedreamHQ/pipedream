import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "plainly",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    renderId: {
      type: "string",
      label: "Render ID",
      description: "The ID of a render",
      async options({ page }) {
        const renders = await this.listRenders({
          params: {
            page,
          },
        });
        return renders.map((render) => ({
          label: `${render.projectName} ${render.templateName} ${render.id}`,
          value: render.id,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the video template",
      async options({ projectId }) {
        const { templates } = await this.getProject({
          projectId,
        });
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The ID of a brand",
      async options() {
        const brands = await this.listBrands();
        return brands.map((brand) => ({
          label: brand.settings.name,
          value: brand.id,
        }));
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID of an article",
      async options({
        brandId, page,
      }) {
        const articles = await this.listArticles({
          brandId,
          params: {
            page,
          },
        });
        return articles.map((article) => ({
          label: article.input.title,
          value: article.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.plainlyvideos.com/api/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: this.$auth.api_key,
          password: "",
        },
        ...otherOpts,
      });
    },
    getProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        ...opts,
      });
    },
    getRender({
      renderId, ...opts
    }) {
      return this._makeRequest({
        path: `/renders/${renderId}`,
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listRenders(opts = {}) {
      return this._makeRequest({
        path: "/renders",
        ...opts,
      });
    },
    listBrands(opts = {}) {
      return this._makeRequest({
        path: "/video-genius/brands",
        ...opts,
      });
    },
    listArticles({
      brandId, ...opts
    }) {
      return this._makeRequest({
        path: `/video-genius/brands/${brandId}/articles`,
        ...opts,
      });
    },
    listVideos({
      brandId, articleId, ...opts
    }) {
      return this._makeRequest({
        path: `/video-genius/brands/${brandId}/articles/${articleId}/videos`,
        ...opts,
      });
    },
    createRender(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/renders",
        ...opts,
      });
    },
  },
};

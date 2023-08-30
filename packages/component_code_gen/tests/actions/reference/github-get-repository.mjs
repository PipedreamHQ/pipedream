import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { ConfigurationError } from "@pipedream/platform";
const CustomOctokit = Octokit.plugin(paginateRest);

export default {
  key: "github-get-repository",
  name: "Get Repository",
  description: "Get specific repository. [See docs here](https://docs.github.com/en/rest/repos/repos#get-a-repository)",
  version: "0.0.9",
  type: "action",
  props: {
    github: {
      type: "app",
      app: "github",
    },
    repoFullname: {
      type: "string",
      label: "Repository",
      description: "The name of the repository. The name is not case sensitive",
      async options({ org }) {
        const repositories = await this.getRepos({
          org,
        });
        return repositories.map((repository) => repository.full_name);
      },
    },
  },
  methods: {
    _baseApiUrl() {
      return "https://api.github.com";
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _client() {
      const client = new CustomOctokit({
        auth: this._accessToken(),
      });
      client.hook.error("request", this.handleRequestException);
      return client;
    },
    handleRequestException(exception) {
      console.error(exception);
      const status = exception?.status;
      if (status && (status === 404 || status === 403)) {
        throw new ConfigurationError(`The request failed with status "${status}". It is likely that your token doesn't have sufficient permissions to execute that request. [see mor information here](https://docs.github.com/en/rest/overview/authenticating-to-the-rest-api?apiVersion=2022-11-28#about-authentication).`);
      }
      throw exception;
    },
    async getRepos() {
      return this._client().paginate("GET /user/repos", {});
    },
    async getRepo({ repoFullname }) {
      const response = await this._client().request(`GET /repos/${repoFullname}`, {});
      return response.data;
    },
  },
  async run({ $ }) {
    const response = await this.getRepo({
      repoFullname: this.repoFullname,
    });

    $.export("$summary", "Successfully retrieved repository.");

    return response;
  },
};

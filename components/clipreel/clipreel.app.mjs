import { axios, ConfigurationError } from "@pipedream/platform";

function itemId(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9-]{8,96}$/.test(value)) {
    throw new ConfigurationError("Enter a valid ClipReel project or job ID.");
  }
  return value;
}

export default {
  type: "app",
  app: "clipreel",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a ClipReel project that already has imported footage.",
    },
    prompt: {
      type: "string",
      label: "Edit Prompt",
      description: "Describe the changes to draft, such as shortening the intro or adding captions.",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID returned by the ClipReel edit or render request.",
    },
  },
  methods: {
    async _request({ $, path, method = "GET", data }) {
      const token = this.$auth.api_token;
      if (typeof token !== "string" || !/^[a-zA-Z0-9_-]{16,256}$/.test(token)) {
        throw new ConfigurationError("Connect a scoped ClipReel agent token.");
      }
      const response = await axios($, {
        method,
        url: "https://www.clipreel.com/api/v1" + path,
        data,
        headers: { Accept: "application/json", Authorization: "Bearer " + token },
        maxRedirects: 0,
        timeout: 20000,
        validateStatus: () => true,
        returnFullResponse: true,
      }).catch(() => {
        throw new Error("ClipReel could not be reached.");
      });

      if (response.status >= 200 && response.status < 300) return response.data;
      const details = {
        400: "Check the project ID, job ID, or prompt.",
        401: "The token is invalid or expired.",
        402: "This operation requires an eligible ClipReel plan.",
        403: "Check the token scopes and account plan.",
        404: "The project or job was not found in the connected account.",
        429: "ClipReel’s rate or usage limit was reached.",
      };
      throw new Error("ClipReel HTTP " + response.status + ". " + (details[response.status] || "Request failed."));
    },
    draftVideoEdit({ $, projectId, prompt }) {
      if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 2000) {
        throw new ConfigurationError("Enter an edit prompt of 1 to 2,000 characters.");
      }
      return this._request({
        $,
        method: "POST",
        path: "/tools/edit_by_prompt",
        data: { projectId: itemId(projectId), prompt: prompt.trim() },
      });
    },
    readVideoJob({ $, jobId }) {
      return this._request({ $, path: "/jobs/" + itemId(jobId) });
    },
  },
};

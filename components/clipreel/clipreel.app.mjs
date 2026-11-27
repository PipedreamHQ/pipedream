import { axios, ConfigurationError } from "@pipedream/platform";

function itemId(value) {
  if (typeof value !== "string" || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value)) {
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
      description: "The ID of a ClipReel project with footage, for example 9d81c1ef-cdb3-4fd0-8c92-4e5cda588152.",
    },
    prompt: {
      type: "string",
      label: "Edit Prompt",
      description: "Describe the changes to draft, for example “Cut the first five seconds and add captions.”",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID returned by an edit or render request, for example 963244db-f624-4a3a-9412-0086a7c4331c.",
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Reuse this key for retries of the same edit, for example launch-cut-v1. Use a new key for each distinct draft.",
      optional: true,
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
        409: "The idempotency key is already in use for a different edit.",
        429: "ClipReel’s rate or usage limit was reached.",
      };
      throw new Error("ClipReel HTTP " + response.status + ". " + (details[response.status] || "Request failed."));
    },
    /** Submit one edit proposal job and return its ID for a later status check. */
    draftVideoEdit({ $, projectId, prompt, idempotencyKey }) {
      if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 2000) {
        throw new ConfigurationError("Enter an edit prompt of 1 to 2,000 characters.");
      }
      const data = { projectId: itemId(projectId), prompt: prompt.trim() };
      if (idempotencyKey) {
        if (typeof idempotencyKey !== "string" || !/^[a-zA-Z0-9._:-]{1,110}$/.test(idempotencyKey)) {
          throw new ConfigurationError("Use 1 to 110 letters, numbers, periods, underscores, colons, or hyphens in the key.");
        }
        data.idempotencyKey = idempotencyKey;
      }
      return this._request({
        $,
        method: "POST",
        path: "/tools/edit_by_prompt",
        data,
      });
    },
    /** Read the status of a single edit or render job in the connected account. */
    readVideoJob({ $, jobId }) {
      return this._request({ $, path: "/jobs/" + itemId(jobId) });
    },
  },
};

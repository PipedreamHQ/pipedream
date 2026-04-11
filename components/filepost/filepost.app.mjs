import FormData from "form-data";
import fetch from "node-fetch";

export default {
  type: "app",
  app: "filepost",
  propDefinitions: {
    fileId: {
      type: "string",
      label: "File ID",
      description: "The unique ID of the uploaded file.",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "A file path in `/tmp` (e.g. `/tmp/image.png`) or a public URL to upload to FilePost CDN.",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://filepost.dev/v1";
    },
    async _request({
      method = "GET", path, body, formData,
    }) {
      const url = `${this._baseUrl()}${path}`;
      const headers = {
        "X-API-Key": this._apiKey(),
      };
      const options = {
        method,
        headers,
      };
      if (formData) {
        options.body = formData;
        Object.assign(headers, formData.getHeaders());
      } else if (body) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
      const res = await fetch(url, options);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`FilePost API error ${res.status}: ${text}`);
      }
      return res.json();
    },
    async uploadFile(fileBuffer, fileName, mimeType) {
      const form = new FormData();
      form.append("file", fileBuffer, {
        filename: fileName,
        contentType: mimeType || "application/octet-stream",
      });
      return this._request({
        method: "POST",
        path: "/upload",
        formData: form,
      });
    },
    async listFiles(page = 1, perPage = 50) {
      return this._request({
        path: `/files?page=${page}&per_page=${perPage}`,
      });
    },
    async getFile(fileId) {
      return this._request({
        path: `/files/${fileId}`,
      });
    },
    async deleteFile(fileId) {
      return this._request({
        method: "DELETE",
        path: `/files/${fileId}`,
      });
    },
  },
};

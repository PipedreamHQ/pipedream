import { axios } from "@pipedream/platform";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";

export default {
  type: "app",
  app: "screenshotone",
  propDefinitions: {
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to take a screenshot of",
    },
    fileName: {
      type: "string",
      label: "File name",
      description: "The new name of the file to be saved without extension. e.g: `screenshot`",
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "The width of the viewport for the screenshot",
      default: 1280,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "The height of the viewport for the screenshot",
      default: 800,
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Whether to take a screenshot of the full page",
      default: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the screenshot",
    },
    blockCookieBanners: {
      type: "boolean",
      label: "Block Cookie Banners",
      description: "Whether to block cookie banners in the screenshot",
      optional: true,
    },
    blockAds: {
      type: "boolean",
      label: "Block Ads",
      description: "Whether to block ads in the screenshot",
      optional: true,
    },
    blockTrackers: {
      type: "boolean",
      label: "Block Trackers",
      description: "Whether to block trackers in the screenshot",
      optional: true,
    },
    delay: {
      type: "integer",
      label: "Delay",
      description: "The delay before taking the screenshot, in seconds",
      max: 30,
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.access_key;
    },
    _apiUrl() {
      return "https://api.screenshotone.com";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          ...args.params,
          access_key: this._apiKey(),
        },
        responseType: "stream",
      });
    },
    takeScreenshot({
      $,
      params,
    }) {
      return this._makeRequest({
        $,
        path: "/take",
        params,
      });
    },
    takeAnimatedScreenshot({
      $,
      params,
    }) {
      return this._makeRequest({
        $,
        path: "/animate",
        params,
      });
    },
    async writeStream({
      fileStream,
      fileName,
    }) {
      const filePath = `/tmp/${fileName}`;
      const pipeline = promisify(stream.pipeline);
      await pipeline(fileStream, fs.createWriteStream(filePath));
      return filePath;
    },
  },
};

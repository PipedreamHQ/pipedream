import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  type: "app",
  app: "pexels",
  propDefinitions: {
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "A keyword or phrase to search for photos.",
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Optional orientation filter for the search.",
      optional: true,
      options: [
        {
          label: "Landscape",
          value: "landscape",
        },
        {
          label: "Portrait",
          value: "portrait",
        },
        {
          label: "Square",
          value: "square",
        },
      ],
    },
    size: {
      type: "string",
      label: "Size",
      description: "Optional size filter for the search.",
      optional: true,
      options: [
        {
          label: "Large",
          value: "large",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Small",
          value: "small",
        },
      ],
    },
    color: {
      type: "string",
      label: "Color",
      description: "Optional color filter for the search.",
      optional: true,
      options: [
        {
          label: "Red",
          value: "red",
        },
        {
          label: "Orange",
          value: "orange",
        },
        {
          label: "Yellow",
          value: "yellow",
        },
        {
          label: "Green",
          value: "green",
        },
        {
          label: "Turquoise",
          value: "turquoise",
        },
        {
          label: "Blue",
          value: "blue",
        },
        {
          label: "Violet",
          value: "violet",
        },
        {
          label: "Pink",
          value: "pink",
        },
        {
          label: "Brown",
          value: "brown",
        },
        {
          label: "Black",
          value: "black",
        },
        {
          label: "Gray",
          value: "gray",
        },
        {
          label: "White",
          value: "white",
        },
      ],
    },
    photoId: {
      type: "string",
      label: "Photo ID",
      description: "The ID of the photo to retrieve or download.",
    },
    desiredSize: {
      type: "string",
      label: "Desired Size",
      description: "Optional size for downloading the photo.",
      optional: true,
      options: [
        {
          label: "Original",
          value: "original",
        },
        {
          label: "Large",
          value: "large",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Small",
          value: "small",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pexels.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async searchPhotos({
      query, orientation, size, color, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/search",
        params: {
          query,
          orientation,
          size,
          color,
        },
        ...opts,
      });
    },
    async getPhoto({
      photoId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/photos/${photoId}`,
        ...opts,
      });
    },
    async downloadPhoto({
      photoId, desiredSize = "original", ...opts
    } = {}) {
      const photoDetails = await this.getPhoto({
        photoId,
      });
      const downloadUrl = desiredSize === "original"
        ? photoDetails.src.original
        : photoDetails.src[desiredSize];
      const response = await axios(this, {
        method: "GET",
        url: downloadUrl,
        responseType: "stream",
      });
      const filePath = `/tmp/photo_${photoId}_${desiredSize}.jpg`;
      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      return filePath;
    },
    async getCuratedPhotos(opts = {}) {
      return this._makeRequest({
        path: "/curated",
        ...opts,
      });
    },
    async emitNewPhotos({
      searchQuery, orientation, color, ...opts
    } = {}) {
      const photos = await this.searchPhotos({
        query: searchQuery,
        orientation,
        color,
        ...opts,
      });
      for (const photo of photos) {
        this.$emit(photo, {
          summary: `New photo: ${photo.id}`,
          id: photo.id,
        });
      }
    },
    async emitNewCuratedPhotos() {
      const photos = await this.getCuratedPhotos();
      for (const photo of photos) {
        this.$emit(photo, {
          summary: `New curated photo: ${photo.id}`,
          id: photo.id,
        });
      }
    },
  },
  async events({ $ }) {
    await this.emitNewCuratedPhotos();
  },
};

import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "what_are_those",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Props for identifying sneakers from an uploaded image
    image: {
      type: "string",
      label: "Image",
      description: "Base64 encoded or multipart form data image.",
    },
    // Props for grading and authenticating sneakers
    frontImage: {
      type: "string",
      label: "Front Image",
      description: "Base64 encoded or multipart form data image of the front.",
    },
    leftImage: {
      type: "string",
      label: "Left Image",
      description: "Base64 encoded or multipart form data image of the left side.",
    },
    rightImage: {
      type: "string",
      label: "Right Image",
      description: "Base64 encoded or multipart form data image of the right side.",
    },
    soleImage: {
      type: "string",
      label: "Sole Image",
      description: "Base64 encoded or multipart form data image of the sole.",
    },
    insoleImage: {
      type: "string",
      label: "Insole Image",
      description: "Base64 encoded or multipart form data image of the insole.",
    },
    sizeTagImage: {
      type: "string",
      label: "Size Tag Image",
      description: "Base64 encoded or multipart form data image of the size tag.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Optional parameter for grading-only results.",
      optional: true,
    },
    // Props for identifying sneakers from a size tag photo
    sizeTagPhoto: {
      type: "string",
      label: "Size Tag Photo",
      description: "File or base64 encoded data of the size tag photo.",
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for the API
    _baseUrl() {
      return "https://api.whatarethose.com";
    },
    // Method to make API requests
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    // Method to identify sneakers from an uploaded image
    async identifySneakers(opts = {}) {
      const { image } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/identify_sneakers",
        data: {
          image: image,
        },
      });
    },
    // Method to grade and authenticate sneakers from multiple images
    async gradeAuthenticateSneakers(opts = {}) {
      const {
        frontImage,
        leftImage,
        rightImage,
        soleImage,
        insoleImage,
        sizeTagImage,
        type,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/grade_authenticate_sneakers",
        data: {
          front: frontImage,
          left: leftImage,
          right: rightImage,
          sole: soleImage,
          insole: insoleImage,
          size_tag: sizeTagImage,
          type: type,
        },
      });
    },
    // Method to identify sneakers from a size tag photo
    async identifySneakersFromSizeTag(opts = {}) {
      const { sizeTagPhoto } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/identify_from_size_tag",
        data: {
          size_tag_photo: sizeTagPhoto,
        },
      });
    },
  },
};

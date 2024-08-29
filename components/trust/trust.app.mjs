import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "trust",
  propDefinitions: {
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The brand if for a registered website / brand (use GET of Websites API endpoint first). It must be of GUID format. Eg. `9d885046-1b7b-4b7b-8b7b-9d8850461b7b`",
      async options() {
        const response = await this.listWebsitesAndBrands();
        return response?.brands?.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    testimonialId: {
      type: "string",
      label: "Testimonial ID",
      description: "The unique identifier for the testimonial to be operated on.",
      async options({ brandId }) {
        const testimonials = await this.listTestimonials({
          brandId,
        });
        return testimonials?.map(({
          id: value, email, firstname, lastname,
        }) => ({
          label: [
            firstname,
            lastname,
            email,
          ].filter(Boolean).join(" ") || value,
          value,
        }));
      },
    },
    testimonialText: {
      type: "string",
      label: "Testimonial Text",
      description: "Text content of the testimonial. Eg. `Always fantastic support. I love that Trust keep bringing out new features!`",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the author of the testimonial.",
    },
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "URL of uploaded video. Required when using an uploaded video along with **Video Token**.",
    },
    videoToken: {
      type: "string",
      label: "Video Token",
      description: "Token of uploaded video. Required when using an uploaded video along with **Video URL**.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the author of the testimonial.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the author of the testimonial.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the testimonial.",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to be associated with the testimonial.",
      optional: true,
    },
    gaveConsent: {
      type: "boolean",
      label: "Gave Consent?",
      description: "Whether the author of the testimonial has given consent for it to be published.",
      optional: true,
    },
    published: {
      type: "boolean",
      label: "Is Published?",
      description: "Is testimonial published to show via any widget?",
      optional: true,
    },
    stars: {
      type: "string",
      label: "Stars",
      description: "The number of stars given in the testimonial. Eg. `5`",
      optional: true,
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuth() {
      return {
        username: "x",
        password: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        auth: this.getAuth(),
        headers: {
          ...headers,
          accept: "application/json",
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    listTestimonials({
      brandId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/testimonial/all/${brandId}`,
        ...args,
      });
    },
    listWebsitesAndBrands(args = {}) {
      return this._makeRequest({
        path: "/websites",
        ...args,
      });
    },
  },
};

import { axios } from "@pipedream/platform";
import { STATUS_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "pingback",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the subscriber. Must be in E.164 format. E.g. +1234567890",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the subscriber",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the subscriber",
      options: STATUS_OPTIONS,
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for the subscriber",
      optional: true,
    },
    segmentationLists: {
      type: "string[]",
      label: "Segmentation Lists",
      description: "Segmentation lists to add the subscriber to. You can get the ID by clicking audience and lists at Pingback dashboard.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://connect.pingback.com/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriber",
        ...opts,
      });
    },
    getSubscriber({
      email, ...opts
    }) {
      return this._makeRequest({
        path: `/subscriber/${email}`,
        ...opts,
      });
    },
    updateSubscriber({
      email, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/subscriber/${email}`,
        ...opts,
      });
    },
    addSubscriberToSegmentationLists({
      email, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/segmentation/add-subscriber/${email}`,
        ...opts,
      });
    },
    removeSubscriberFromSegmentationList({
      email, segmentationListId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/segmentation/${segmentationListId}/remove-subscriber/${email}`,
        ...opts,
      });
    },
  },
};

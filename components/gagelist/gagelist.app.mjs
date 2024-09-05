import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "gagelist",
  propDefinitions: {
    gageId: {
      type: "string",
      label: "Gage ID",
      description: "The ID of the gage",
      async options({ page }) {
        const { data } = await this.listGages({
          params: {
            record_number: constants.DEFAULT_LIMIT,
            start: (page * constants.DEFAULT_LIMIT) + 1,
          },
        });
        return data?.map(({ Id: id }) => ({
          value: `${id}`,
          label: `Gage ID# ${id}`,
        })) || [];
      },
    },
    manufacturer: {
      type: "string",
      label: "Manufacturer",
      description: "Manufacturer of the gage",
      optional: true,
      async options() {
        const { data } = await this.listManufacturers();
        return data?.map(({ Name: name }) => name) || [];
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the gage",
      options: constants.STATUS,
    },
    lastCalibrationDate: {
      type: "string",
      label: "Last Calibration Date",
      description: "The last calibration date of the gage in ISO-8601 format. Example `2024-03-15T02:27:16Z`",
      optional: true,
    },
    calibrationDueDate: {
      type: "string",
      label: "Next Calibration Due",
      description: "The next calibration due date of the gage in ISO-8601 format. Example: `2024-03-15T02:27:16Z`",
      optional: true,
    },
    controlNumber: {
      type: "string",
      label: "Control Number",
      description: "Control number of the gage",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the gague. Example: `Flow Meter`",
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model of the gage",
      optional: true,
    },
    condition: {
      type: "string",
      label: "Condition Acquired",
      description: "The condition of the gage",
      optional: true,
      options: constants.CONDITION,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Calibration instructions for the gage",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://gagelist.net/GageList/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listGages(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Gage/List",
        ...opts,
      });
    },
    listManufacturers(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Manufacturer/List",
        ...opts,
      });
    },
    listCalibrations(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Calibration/List",
        ...opts,
      });
    },
    getGage({
      gageId, ...opts
    }) {
      return this._makeRequest({
        path: `/Gage/Detail/${gageId}`,
        ...opts,
      });
    },
    createGage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Gage/Create",
        ...opts,
      });
    },
    updateGage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Gage/Update",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params = {},
    }) {
      params = {
        ...params,
        record_number: constants.DEFAULT_LIMIT,
        start: 0,
      };
      while (true) {
        const { data } = await resourceFn({
          params,
        }); console.log(data);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
        }
        params.start += constants.DEFAULT_LIMIT;
      }
    },
  },
};

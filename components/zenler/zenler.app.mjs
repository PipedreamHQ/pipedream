import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zenler",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user",
      async options(args) {
        return this.getResourceOptions({
          ...args,
          resourceFn: this.getUsers,
          mapper: (resource) => ({
            label: `${resource.first_name} ${resource.last_name} (${resource.email})`,
            value: resource.id,
          }),
        });
      },
    },
    courseId: {
      type: "string",
      label: "Course ID",
      description: "ID of the course",
      async options(args) {
        return this.getResourceOptions({
          ...args,
          resourceFn: this.getCourses,
          mapper: ({
            id: value, name: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
    liveClassId: {
      type: "string",
      label: "Live Class ID",
      description: "ID of the live class",
      async options(args) {
        return this.getResourceOptions({
          ...args,
          resourceFn: this.getLiveClasses,
          mapper: ({
            id: value, topic: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
    webinarId: {
      type: "string",
      label: "Webinar ID",
      description: "ID of the webinar",
      async options(args) {
        return this.getResourceOptions({
          ...args,
          resourceFn: this.getLiveWebinars,
          mapper: ({
            id: value, topic: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
    funnelId: {
      type: "string",
      label: "Funnel ID",
      description: "ID of the funnel",
      async options(args) {
        return this.getResourceOptions({
          ...args,
          resourceFn: this.getFunnels,
          mapper: ({
            id: value, name: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL.replace(constants.API_PLACEHOLDER, this.$auth.account_name)}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Key": this.$auth.api_key,
        "X-Account-Name": this.$auth.account_name,
        ...headers,
      };
    },
    async makeRequest({
      $ = this, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };
      try {
        return await axios($, config);
      } catch (error) {
        const msg = error.response?.data ?? error;
        console.log("Request error", msg);
        throw msg?.data?.message || error;
      }
    },
    createUser(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/users",
        ...args,
      });
    },
    getUsers(args = {}) {
      return this.makeRequest({
        path: "/users",
        ...args,
      });
    },
    getCourse({
      courseId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/courses/${courseId}`,
        ...args,
      });
    },
    getCourses(args = {}) {
      return this.makeRequest({
        path: "/courses",
        ...args,
      });
    },
    getCoursesBrief(args = {}) {
      return this.makeRequest({
        path: "/reports/course-progress/brief",
        ...args,
      });
    },
    getCoursesDetailed(args = {}) {
      return this.makeRequest({
        path: "/reports/course-progress/detailed",
        ...args,
      });
    },
    enrollUser({
      userId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/users/${userId}/enroll`,
        ...args,
      });
    },
    unenrollUser({
      userId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/users/${userId}/unenroll`,
        ...args,
      });
    },
    getLiveClasses(args = {}) {
      return this.makeRequest({
        path: "/live-class/get-live-classes-list",
        ...args,
      });
    },
    registerLiveClass({
      liveClassId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/live-class/${liveClassId}/register`,
        ...args,
      });
    },
    getLiveWebinars(args = {}) {
      return this.makeRequest({
        path: "/live-webinar/get-live-webinars-list",
        ...args,
      });
    },
    registerLiveWebinar({
      webinarId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/live-webinar/${webinarId}/register`,
        ...args,
      });
    },
    getFunnels(args = {}) {
      return this.makeRequest({
        path: "/funnels",
        ...args,
      });
    },
    subscribeToFunnel({
      funnelId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/funnels/${funnelId}/subscribe`,
        ...args,
      });
    },
    getFunnelSubscriptions({
      funnelId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/funnels/enrollments/${funnelId}`,
        ...args,
      });
    },
    getSalesBrief(args = {}) {
      return this.makeRequest({
        path: "/reports/sales/brief",
        ...args,
      });
    },
    getSalesDetailed(args = {}) {
      return this.makeRequest({
        path: "/reports/sales/detailed",
        ...args,
      });
    },
    async getResourceOptions({
      page, resourceFn, mapper,
    }) {
      const { data } = await resourceFn({
        params: {
          limit: constants.DEFAULT_LIMIT,
          page: page + 1,
        },
      });
      const { items } = data;
      return items.map(mapper);
    },
    getNextResources(items) {
      return Array.isArray(items)
        ? items
        : Object.entries(items)
          .map(([
            key,
            resource,
          ]) => ({
            ...resource,
            id: resource.id || key,
          }));
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let page = 1;
      let resourcesCount = 0;
      let response;

      while (true) {
        try {
          response =
            await resourceFn({
              ...resourceFnArgs,
              params: {
                page,
                limit: constants.DEFAULT_LIMIT,
                ...resourceFnArgs.params,
              },
            });

          const isStringResponse = typeof(response) === "string";

          if (isStringResponse && !response) {
            return;
          }

          if (isStringResponse && response) {
            throw response;
          }
        } catch (error) {
          console.log("Stream error", error);
          return;
        }

        const {
          items,
          pagination,
        } = response.data;
        const nextResources = this.getNextResources(items);

        if (nextResources?.length < 1) {
          return;
        }

        page += 1;

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (page > pagination.total_pages) {
          return;
        }

        if (max && resourcesCount >= max) {
          return;
        }
      }
    },
  },
};

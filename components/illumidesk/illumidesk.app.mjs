import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "illumidesk",
  propDefinitions: {
    courseSlug: {
      type: "string",
      label: "Course ID",
      description: "The slug for the course",
      async options({
        campusSlug, prevContext,
      }) {
        const args = {
          campusSlug,
        };
        if (prevContext?.next) {
          args.url = prevContext.next;
        }
        const {
          results, next,
        } = await this.listCoursesByCampus(args);
        const options = results?.map(({
          slug: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            next,
          },
        };
      },
    },
    campusSlug: {
      type: "string",
      label: "Campus Slug",
      description: "The slug for the campus",
      async options() {
        const campuses = await this.listCampuses();
        return campuses?.map(({
          slug: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.illumidesk.com/api/v1";
    },
    _headers() {
      return {
        Authorization: `Token ${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherOpts,
      });
    },
    listCampuses(args = {}) {
      return this._makeRequest({
        path: "/campuses/",
        ...args,
      });
    },
    listCourseActivities({
      courseSlug, ...args
    }) {
      return this._makeRequest({
        path: `/courses/${courseSlug}/activities/`,
        ...args,
      });
    },
    listCourseParticipants({
      courseSlug, ...args
    }) {
      return this._makeRequest({
        path: `/courses/${courseSlug}/participants/`,
        ...args,
      });
    },
    listCourseLessons({
      courseSlug, ...args
    }) {
      return this._makeRequest({
        path: `/courses/${courseSlug}/lessons/`,
        ...args,
      });
    },
    createCourse({
      campusSlug, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campuses/${campusSlug}/courses/`,
        ...args,
      });
    },
    inviteUserToCourse({
      courseSlug, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/courses/${courseSlug}/invitations/`,
        ...args,
      });
    },
    listCoursesByCampus({
      campusSlug, ...args
    }) {
      return this._makeRequest({
        path: `/campuses/${campusSlug}/courses/`,
        ...args,
      });
    },
    async *paginate({
      resourceFn, args,
    }) {
      do {
        const response = await resourceFn(args);
        const items = response?.results || response;
        for (const item of items) {
          yield item;
        }
        args.url = response?.next;
      } while (args.url);
    },
  },
};

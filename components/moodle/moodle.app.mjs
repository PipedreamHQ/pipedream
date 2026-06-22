import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "moodle",
  propDefinitions: {
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course",
      async options() {
        const courses = await this.getCourses();
        return courses?.map(({
          id, fullname,
        }) => ({
          label: fullname,
          value: String(id),
        })) ?? [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const { users } = await this.searchUsers({
          params: {
            "criteria[0][key]": "suspended",
            "criteria[0][value]": 0,
          },
        });
        return users?.map(({
          id, fullname,
        }) => ({
          label: fullname,
          value: String(id),
        })) ?? [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category",
      async options() {
        const categories = await this.getCategories();
        return categories?.map(({
          id, name,
        }) => ({
          label: name,
          value: String(id),
        })) ?? [];
      },
    },
    sectionId: {
      type: "string",
      label: "Section ID",
      description: "The ID of the section",
      async options({ courseId }) {
        if (!courseId) return [];
        const sections = await this.getCourseContents({
          params: {
            courseid: courseId,
          },
        });
        return sections?.map(({
          id, name,
        }) => ({
          label: name,
          value: String(id),
        })) ?? [];
      },
    },
    moduleId: {
      type: "string",
      label: "Module ID",
      description: "The ID of the module",
      async options({
        courseId, sectionId,
      }) {
        if (!courseId || !sectionId) return [];
        const contents = await this.getCourseContents({
          params: {
            courseid: courseId,
          },
        });
        const section = contents.find(({ id }) => id == sectionId);
        const modules = section?.modules ?? [];
        return modules?.map(({
          id, name,
        }) => ({
          label: name,
          value: String(id),
        })) ?? [];
      },
    },
    contentItemId: {
      type: "string",
      label: "Content Item ID",
      description: "The ID of the content item",
      async options({
        courseId, sectionId,
      }) {
        if (!courseId || !sectionId) return [];
        const { content_items: contentItems } = await this.getCourseContentItems({
          params: {
            courseid: courseId,
            sectionid: sectionId,
          },
        });
        return contentItems?.map(({
          id, title,
        }) => ({
          label: title,
          value: String(id),
        })) ?? [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/webservice/rest/server.php`;
    },
    async _makeRequest({
      $ = this, params, ...opts
    }) {
      const response = await axios($, {
        baseURL: this._baseUrl(),
        params: {
          ...params,
          wstoken: this.$auth.api_token,
          moodlewsrestformat: "json",
        },
        ...opts,
      });
      if (response?.exception) {
        throw new Error(response.message);
      }
      return response;
    },
    getCourses({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_get_courses",
          ...params,
        },
        ...opts,
      });
    },
    getCategories({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_get_categories",
          ...params,
        },
        ...opts,
      });
    },
    searchUsers({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_user_get_users",
          ...params,
        },
        ...opts,
      });
    },
    createCourses({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_create_courses",
          ...params,
        },
        ...opts,
      });
    },
    createUsers({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_user_create_users",
          ...params,
        },
        ...opts,
      });
    },
    createCategories({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_create_categories",
          ...params,
        },
        ...opts,
      });
    },
    deleteCategories({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_delete_categories",
          ...params,
        },
        ...opts,
      });
    },
    deleteCourses({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_delete_courses",
          ...params,
        },
        ...opts,
      });
    },
    duplicateCourse({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_duplicate_course",
          ...params,
        },
        ...opts,
      });
    },
    enrollUsers({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "enrol_manual_enrol_users",
          ...params,
        },
        ...opts,
      });
    },
    getCoursesByField({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_get_courses_by_field",
          ...params,
        },
        ...opts,
      });
    },
    getCourseContents({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_get_contents",
          ...params,
        },
        ...opts,
      });
    },
    getCourseContentItems({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_courseformat_get_section_content_items",
          ...params,
        },
        ...opts,
      });
    },
    getCourseModule({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_get_course_module",
          ...params,
        },
        ...opts,
      });
    },
    getCourseUpdates({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_get_updates_since",
          ...params,
        },
        ...opts,
      });
    },
    getEnrolledCoursesByTimeline({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_get_enrolled_courses_by_timeline_classification",
          ...params,
        },
        ...opts,
      });
    },
    getEnrolledUsers({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_enrol_get_enrolled_users",
          ...params,
        },
        ...opts,
      });
    },
    importCourse({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_import_course",
          ...params,
        },
        ...opts,
      });
    },
    viewCourse({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_view_course",
          ...params,
        },
        ...opts,
      });
    },
    searchCourses({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        params: {
          wsfunction: "core_course_search_courses",
          ...params,
        },
        ...opts,
      });
    },
    setFavouriteCourses({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_set_favourite_courses",
          ...params,
        },
        ...opts,
      });
    },
    updateCourses({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_update_courses",
          ...params,
        },
        ...opts,
      });
    },
    updateUsers({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_user_update_users",
          ...params,
        },
        ...opts,
      });
    },
    updateCategories({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_update_categories",
          ...params,
        },
        ...opts,
      });
    },
    addContentItemToFavorites({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_add_content_item_to_user_favourites",
          ...params,
        },
        ...opts,
      });
    },
    removeContentItemFromFavorites({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        params: {
          wsfunction: "core_course_remove_content_item_from_user_favourites",
          ...params,
        },
        ...opts,
      });
    },
  },
};

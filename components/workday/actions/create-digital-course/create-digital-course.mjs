import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import utils from "../../sources/common/utils.mjs";

export default {
  key: "workday-create-digital-course",
  name: "Create Digital Course",
  description: "Create a digital learning course. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#learning/v1/post-/manageDigitalCourses)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    topics: {
      type: "string[]",
      label: "Topics",
      description: "The topics of the learning course event. Example: `[ { \"descriptor\": \"Leadership\", \"id\": \"topic-id-1\" } ]`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Course title. Example: `Digital Leadership 101`",
    },
    availabilityStatus: {
      type: "object",
      label: "Availability Status",
      description: "The status of the learning course event. Example: `{ \"id\": \"status-id-1\" }`",
    },
    lessons: {
      type: "string[]",
      label: "Lessons",
      description: "The course lessons of the learning course event. Example: `[ { \"title\": \"Lesson 1\", \"type\": { \"id\": \"type-id\" }, \"order\": 1, \"url\": \"https://...\", \"required\": true } ]`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Course description. Example: `Learn digital leadership strategies for remote teams.`",
    },
  },
  async run({ $ }) {
    const parsedTopics = utils.parseJsonInput(this.topics);
    const parsedLessons = utils.parseJsonInput(this.lessons);

    if (!Array.isArray(parsedTopics) || parsedTopics.length === 0) {
      throw new ConfigurationError("`topics` must be a non-empty array.");
    }
    for (const t of parsedTopics) {
      if (!t.id || !t.descriptor) {
        throw new ConfigurationError("Each topic must have both `id` and `descriptor`.");
      }
    }

    if (!Array.isArray(parsedLessons) || parsedLessons.length === 0) {
      throw new ConfigurationError("`lessons` must be a non-empty array.");
    }
    for (const l of parsedLessons) {
      if (!l.title || !l.type?.id || typeof l.order !== "number" || !l.url) {
        throw new ConfigurationError("Each lesson must include `title`, `type` (object with id), `order` (integer), and `url`.");
      }
    }

    if (!this.title || !this.title.trim()) {
      throw new ConfigurationError("`title` is required.");
    }
    if (!this.availabilityStatus || typeof this.availabilityStatus !== "object" || !this.availabilityStatus.id) {
      throw new ConfigurationError("`availabilityStatus` is required and must be an object with a non-empty 'id'.");
    }
    if (!this.description || !this.description.trim()) {
      throw new ConfigurationError("`description` is required.");
    }

    const data = {
      topics: parsedTopics,
      title: this.title,
      availabilityStatus: utils.parseObject(this.availabilityStatus),
      lessons: parsedLessons,
      description: this.description,
    };

    const response = await this.workday.createDigitalCourse({
      $,
      data,
    });
    $.export("$summary", "Digital course created");
    return response;
  },
};

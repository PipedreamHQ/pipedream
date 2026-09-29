import { ConfigurationError } from "@pipedream/platform";
import app from "../upload_post.app.mjs";
import utils from "./utils.mjs";

/**
 * Props and helpers shared by the Upload Video, Upload Photos and Upload Text
 * actions. Each action spreads `props` and adds its own media / platform props.
 */
export default {
  props: {
    app,
    user: {
      propDefinition: [
        app,
        "user",
      ],
    },
  },
  methods: {
    getCommonFields() {
      return {
        "user": this.user,
        "platform[]": this.platforms,
        "title": this.title,
        "description": this.description,
        "scheduled_date": this.scheduledDate,
        "timezone": this.timezone,
        "add_to_queue": this.addToQueue,
        "async_upload": this.asyncUpload,
        "first_comment": this.firstComment,
        "external_id": this.externalId,
      };
    },
    validate() {
      if (this.scheduledDate && this.addToQueue) {
        throw new ConfigurationError("`scheduledDate` and `addToQueue` cannot be used together");
      }
    },
    buildFields(specificFields = {}) {
      this.validate();
      return {
        ...this.getCommonFields(),
        ...specificFields,
        ...utils.parseObject(this.additionalFields),
      };
    },
    getSummary(response) {
      if (response?.job_id) {
        return `Successfully scheduled post with job ID \`${response.job_id}\``;
      }
      if (response?.request_id) {
        return `Successfully submitted upload with request ID \`${response.request_id}\``;
      }
      return "Successfully submitted upload";
    },
  },
};

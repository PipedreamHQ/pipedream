import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "convertkit-webhook-events",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for each selected event types. [See docs here](https://developers.convertkit.com/#create-a-webhook)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    event: {
      label: "Webhook Events",
      description: "The event will be emitted",
      type: "string",
      options: constants.WEBHOOK_EVENTS.map(({
        value, label,
      }) => ({
        value,
        label,
      })),
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const optionalProps = constants.WEBHOOK_EVENTS
      .find((ev) => this.event === ev.value)?.additionalProps;
    if (optionalProps?.includes("form")) {
      props.form = {
        type: "integer",
        label: "Form",
        description: "Select a form",
        options: async () => {
          const response = await this.convertkit.listForms();
          return response.forms.map((form) => ({
            label: form.name,
            value: form.id,
          }));
        },
      };
    } else if (optionalProps?.includes("course")) {
      props.course = {
        type: "integer",
        label: "Course",
        description: "Select a course",
        options: async () => {
          const response = await this.convertkit.listCourses();
          return response.courses.map((course) => ({
            label: course.name,
            value: course.id,
          }));
        },
      };
    } else if (optionalProps?.includes("initiator")) {
      props.link = {
        type: "string",
        label: "Link",
        description: "link URL",
      };
    } else if (optionalProps?.includes("tag")) {
      props.tag = {
        type: "integer",
        label: "Tag",
        description: "Select a tag",
        options: async () => {
          const response = await this.convertkit.listTags();
          return response.tags.map((tag) => ({
            label: tag.name,
            value: tag.id,
          }));
        },
      };
    }
    return props;
  },
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return {
        name: this.event,
        form_id: this.form,
        course_id: this.course,
        initiator_value: this.link,
        tag_id: this.tag,
      };
    },
    async processEvent(event) {
      const {
        headers,
        body,
      } = event;

      this.$emit(body, {
        id: headers.tracestate,
        summary: `New event of type ${constants.WEBHOOK_EVENTS
          .find((ev) => this.event === ev.value).label}`,
        ts: new Date().getTime(),
      });
    },
  },
};

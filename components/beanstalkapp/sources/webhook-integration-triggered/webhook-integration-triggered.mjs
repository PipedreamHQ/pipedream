import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "beanstalkapp-webhook-integration-triggered",
  name: "New Webhook Integration Triggered (Instant)",
  description: "Emit new event when selected flags trigger the webhook. [See the docs](https://api.beanstalkapp.com/integration.html#webhooks).",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    commit:	{
      type: "boolean",
      label: "Commit",
      description: "On each commit (Subversion only).",
      optional: true,
    },
    push:	{
      type: "boolean",
      label: "Push",
      description: "On each push (Git only).",
      optional: true,
    },
    deploy:	{
      type: "boolean",
      label: "Deploy",
      description: "Every time a deployment is finished.",
      optional: true,
    },
    comment:	{
      type: "boolean",
      label: "Comment",
      description: "Any comment is posted on a changeset, a file or a code review.",
      optional: true,
    },
    create_branch:	{
      type: "boolean",
      label: "Create Branch",
      description: "When a branch is created.",
      optional: true,
    },
    delete_branch:	{
      type: "boolean",
      label: "Delete Branch",
      description: "When a branch is deleted.",
      optional: true,
    },
    create_tag:	{
      type: "boolean",
      label: "Create Tag",
      description: "When a tag is created.",
      optional: true,
    },
    delete_tag: {
      type: "boolean",
      label: "Delete Tag",
      description: "When a tag is deleted.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEventName() {
      const {
        commit,
        push,
        deploy,
        comment,
        create_branch,
        delete_branch,
        create_tag,
        delete_tag,
      } = this;
      return {
        commit,
        push,
        deploy,
        comment,
        create_branch,
        delete_branch,
        create_tag,
        delete_tag,
      };
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "New Event Triggered",
        ts,
      };
    },
  },
};

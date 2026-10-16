import getbody from "../../getbody.app.mjs";

export default {
  key: "getbody-find-robot-for-task",
  name: "Find Robot For Task",
  description: "Describe a real-world task in plain words and get the robots listed on GetBody that could do it. Nothing is booked: the request is recorded so GetBody can follow up if no robot fits yet. [See the documentation](https://getbody.md/llms.txt)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    getbody,
    task: {
      type: "string",
      label: "Task",
      description: "What needs doing, in plain words (up to 1000 characters), e.g. `Water the plants on my balcony every morning`",
    },
    location: {
      type: "string",
      label: "Location",
      description: "Where the task is, e.g. `Berlin, Germany` (up to 200 characters)",
      optional: true,
    },
    when: {
      type: "string",
      label: "When",
      description: "When it should happen, e.g. `next Monday morning` (up to 200 characters)",
      optional: true,
    },
    notifyEmail: {
      type: "string",
      label: "Notify Email",
      description: "An email address GetBody can write to when a robot for this task is available",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.task.length > 1000) {
      throw new Error("**Task** must be at most 1000 characters.");
    }
    const response = await this.getbody.findRobotForTask({
      $,
      data: {
        task: this.task,
        location: this.location,
        when: this.when,
        notify_email: this.notifyEmail,
      },
    });
    const count = response.matches?.length || 0;
    $.export("$summary", count
      ? `Found ${count} robot${count === 1
        ? ""
        : "s"}`
      : "No robot yet, request recorded");
    return response;
  },
};

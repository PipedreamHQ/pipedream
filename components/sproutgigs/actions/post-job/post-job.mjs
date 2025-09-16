import app from "../../sproutgigs.app.mjs";

export default {
  key: "sproutgigs-post-job",
  name: "Post Job",
  description: "Post a new job to Sproutgigs. [See the documentation](https://sproutgigs.com/api/documentation.php#jobs-post)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    test: {
      propDefinition: [
        app,
        "test",
      ],
    },
    zoneId: {
      propDefinition: [
        app,
        "zoneId",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    instructions: {
      propDefinition: [
        app,
        "instructions",
      ],
    },
    proofs: {
      propDefinition: [
        app,
        "proofs",
      ],
    },
    numTasks: {
      propDefinition: [
        app,
        "numTasks",
      ],
    },
    taskValue: {
      propDefinition: [
        app,
        "taskValue",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.postJob({
      $,
      data: {
        test: this.test
          ? 1
          : 0,
        zone_id: this.zoneId,
        category_id: this.categoryId,
        title: this.title,
        instructions: this.instructions,
        proofs: JSON.parse(this.proofs),
        num_tasks: this.numTasks,
        task_value: this.taskValue,
      },
    });

    if (response.ok === false) {
      throw new Error(`Job creation failed: ${response.message}`);
    }

    $.export("$summary", "Successfully sent the request. Result message: " + response.message);
    return response;
  },
};

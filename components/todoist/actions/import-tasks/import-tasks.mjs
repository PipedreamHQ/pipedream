import todoist from "../../todoist.app.mjs";
import converter from "json-2-csv";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "todoist-import-tasks",
  name: "Import Tasks",
  description: "Import tasks into a selected project. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/create_task_api_v1_tasks_post)",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    path: {
      propDefinition: [
        todoist,
        "path",
      ],
    },
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "Project to import tasks into",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    exportSummary($, tasks) {
      $.export("$summary", `Successfully imported ${tasks.length} task${tasks.length === 1
        ? ""
        : "s"} from "${this.path}"`);
    },
  },
  async run ({ $ }) {
    const {
      path,
      project,
    } = this;

    const stream = await getFileStream(path);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const fileContents = Buffer.concat(chunks).toString();
    const tasks = converter.csv2json(fileContents);
    // CREATE TASKS
    const data = tasks.map((task) => ({
      content: task.content,
      description: task.description,
      project_id: project,
      due: task.due,
      priority: task.priority,
      child_order: task.order,
      labels: task.label_ids,
    }));
    const {
      responses: createResponses,
      tempIds,
    } = await this.todoist.createTasks({
      $,
      data,
    });

    const childTasks = tasks.filter((task) => task.parent_id);

    if (childTasks.length === 0) {
      this.exportSummary($, tasks);
      return {
        createResponses,
      };
    }

    // MOVE CHILD TASKS (set parent_id)

    // `createTasks` returns an array object containing a `temp_id_mapping` property, which maps
    // command `temp_id`s to real task `id`s. Combine these mappings into a single object.
    const tempIdMapping = createResponses.reduce((mapping, response) => {
      mapping = {
        ...mapping,
        ...response.temp_id_mapping,
      };
      return mapping;
    }, {});

    // Create mapping from ID of imported task to ID of new task in `project`, using `tempIdMapping`
    const idMapping = tasks.reduce((mapping, task, index) => {
      mapping[task.id] = tempIdMapping[tempIds[index]];
      return mapping;
    }, {});

    const moveData = childTasks.map((task) => ({
      id: idMapping[task.id],
      parent_id: idMapping[task.parent_id],
    }));

    const { responses: moveResponses } = await this.todoist.moveTasks({
      $,
      data: moveData,
    });

    this.exportSummary($, tasks);

    return {
      createResponses,
      moveResponses,
    };
  },
};

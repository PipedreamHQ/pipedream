import wakatime from "../../wakatime.app.mjs";

export default {
  key: "wakatime-log-coding-activity",
  name: "Log Coding Activity",
  description: "Log coding activity to WakaTime. [See the documentation](https://wakatime.com/developers#heartbeats)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wakatime,
    entity: {
      type: "string",
      label: "Entity",
      description: "The entity heartbeat is logging time against, such as an absolute file path or domain",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of entity (file, app or domain)",
      default: "file",
      options: [
        "file",
        "app",
        "domain",
      ],
    },
    time: {
      type: "string",
      label: "Time",
      description: "UNIX epoch timestamp; numbers after decimal point are fractions of a second",
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category for this activity",
      optional: true,
      options: [
        "coding",
        "building",
        "indexing",
        "debugging",
        "browsing",
        "running tests",
        "writing tests",
        "manual testing",
        "writing docs",
        "communicating",
        "code reviewing",
        "researching",
        "learning",
        "designing",
      ],
    },
    project: {
      propDefinition: [
        wakatime,
        "project",
      ],
      optional: true,
    },
    projectRootCount: {
      type: "integer",
      label: "Project Root Count",
      description: "Count of the number of folders in the project root path (optional); for ex: if the project folder is /Users/user/projects/wakatime and the entity path is /Users/user/projects/wakatime/models/user.py then the project_root_count is 5 and the relative entity path after removing 5 prefix folders is models/user.py",
      optional: true,
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "Branch name",
      optional: true,
    },
    language: {
      propDefinition: [
        wakatime,
        "language",
      ],
    },
    dependencies: {
      type: "string",
      label: "Dependencies",
      description: "Comma separated list of dependencies",
      optional: true,
    },
    lines: {
      type: "integer",
      label: "Lines",
      description: "Total number of lines in the entity (when entity type is file)",
      optional: true,
    },
    lineAdditions: {
      type: "integer",
      label: "Line Additions",
      description: "Number of lines added since last heartbeat in the current file",
      optional: true,
    },
    lineDeletions: {
      type: "integer",
      label: "Line Deletions",
      description: "Number of lines removed since last heartbeat in the current file",
      optional: true,
    },
    lineNo: {
      type: "integer",
      label: "Line Number",
      description: "Current line row number of cursor with the first line starting at 1",
      optional: true,
    },
    cursorPos: {
      type: "integer",
      label: "Cursor Position",
      description: "Current cursor column position starting from 1",
      optional: true,
    },
    isWrite: {
      type: "boolean",
      label: "Is Write",
      description: "Whether this heartbeat was triggered from writing to a file",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.wakatime.createHeartbeat({
      $,
      data: {
        entity: this.entity,
        type: this.type,
        category: this.category,
        time: this.time,
        project: this.project,
        project_root_count: this.projectRootCount,
        branch: this.branch,
        language: this.language,
        dependencies: this.dependencies,
        lines: this.lines,
        line_additions: this.lineAdditions,
        line_deletions: this.lineDeletions,
        line_no: this.lineNo,
        cursor_pos: this.cursorPos,
        is_write: this.isWrite,
      },
    });

    $.export("$summary", `Successfully logged coding activity for ${this.entity}`);
    return data;
  },
};

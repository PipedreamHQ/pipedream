import { ConfigurationError } from "@pipedream/platform";
import app from "../../lever.app.mjs";

export default {
  key: "lever-create-posting",
  name: "Create Posting",
  description:
    "Creates a new job posting in Lever."
    + " Use this when asked to open a new role or create a job listing."
    + " Postings created via the API do not go through the approvals chain and default to `draft` state."
    + " Perform As is required — it sets the posting creator and default owner."
    + " The `categories` object organises the posting by team, department, location, and commitment type."
    + " Lever validates these against the account's configured categories: a `team` must be supplied together with its parent `department` (a team on its own is rejected as 'not a valid subset')."
    + " Use **List Postings** to discover valid team/department/location values from existing postings before creating one."
    + " Example: call with performAs=\"<userId>\", text=\"Senior Software Engineer\", team=\"Platform Team\", department=\"Product\", location=\"San Francisco\" → returns the created posting (in `draft` state) with its id."
    + " [See the documentation](https://hire.lever.co/developer/documentation#create-a-posting)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    performAs: {
      propDefinition: [
        app,
        "performAs",
      ],
      description: "User ID of the person creating the posting — sets the creator and default owner. Use **List Users** to find user IDs.",
    },
    text: {
      type: "string",
      label: "Job Title",
      description: "Title of the job posting (e.g. `Senior Software Engineer`).",
    },
    state: {
      type: "string",
      label: "State",
      description: "Initial state of the posting. Defaults to `draft` if omitted.",
      optional: true,
      options: [
        "draft",
        "published",
        "internal",
        "closed",
        "pending",
        "rejected",
      ],
    },
    team: {
      type: "string",
      label: "Team",
      description: "Team category tag (e.g. `Engineering`, `Sales`). Case-sensitive.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "Department category tag (e.g. `Product`). Case-sensitive.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Location category tag (e.g. `San Francisco`, `Remote`). Case-sensitive.",
      optional: true,
    },
    commitment: {
      type: "string",
      label: "Commitment",
      description: "Work type category tag (e.g. `Full-time`, `Part-time`, `Internship`). Case-sensitive.",
      optional: true,
    },
    descriptionHtml: {
      type: "string",
      label: "Job Description (HTML)",
      description: "Job posting description shown at the top of the listing. Accepts HTML.",
      optional: true,
    },
    lists: {
      type: "string",
      label: "Content Lists (JSON)",
      description: "JSON array of content sections with `text` (heading) and `content` (HTML body). Example: `[{\"text\": \"Responsibilities\", \"content\": \"<li>Build features</li>\"}]`",
      optional: true,
    },
    closingHtml: {
      type: "string",
      label: "Closing Statement (HTML)",
      description: "Custom closing statement shown at the bottom of the listing. Accepts HTML.",
      optional: true,
    },
    workplaceType: {
      type: "string",
      label: "Workplace Type",
      description: "Workplace arrangement. Lever leaves this unspecified if omitted.",
      optional: true,
      options: [
        "onsite",
        "remote",
        "hybrid",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      perform_as: this.performAs,
    };

    const categories = {};
    if (this.team) categories.team = this.team;
    if (this.department) categories.department = this.department;
    if (this.location) categories.location = this.location;
    if (this.commitment) categories.commitment = this.commitment;

    const content = {};
    if (this.descriptionHtml) content.descriptionHtml = this.descriptionHtml;
    if (this.lists) {
      try {
        content.lists = JSON.parse(this.lists);
      } catch {
        throw new ConfigurationError("Content Lists must be a valid JSON array. Example: [{\"text\": \"Responsibilities\", \"content\": \"<li>Build features</li>\"}]");
      }
    }
    if (this.closingHtml) content.closingPostingHtml = this.closingHtml;

    const body = {
      text: this.text,
    };
    if (this.state) body.state = this.state;
    if (this.workplaceType) body.workplaceType = this.workplaceType;
    if (Object.keys(categories).length) body.categories = categories;
    if (Object.keys(content).length) body.content = content;

    const response = await this.app.createPosting({
      $,
      params,
      data: body,
    });
    const posting = response.data ?? response;
    $.export("$summary", `Created posting "${this.text}" (${posting.id})`);
    return posting;
  },
};

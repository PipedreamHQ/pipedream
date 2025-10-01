import pipefy from "../../pipefy.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "pipefy-create-pipe",
  name: "Create Pipe",
  description: "Creates a pipe. [See the docs here](https://api-docs.pipefy.com/reference/mutations/createPipe/)",
  version: "0.3.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipefy,
    organization: {
      propDefinition: [
        pipefy,
        "organization",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new Pipe",
    },
    phases: {
      type: "string[]",
      label: "Phase Names",
      description: "Names of the new Pipe's phases",
      reloadProps: true,
    },
    members: {
      propDefinition: [
        pipefy,
        "members",
        (c) => ({
          orgId: c.organization,
        }),
      ],
      withLabel: true,
      reloadProps: true,
    },
    icon: {
      type: "string",
      label: "Icon",
      description: "The Pipe icon",
      options: constants.ICON_OPTIONS,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.phases?.length > 0) {
      for (const phase of this.phases) {
        props[phase] = {
          type: "boolean",
          label: `${phase} Done?`,
          description: `Is ${phase} a final/done phase?`,
          default: false,
        };
      }
    }
    if (this.members?.length > 0) {
      for (const member of this.members) {
        props[member.value] = {
          type: "string",
          label: `Role for ${member.label}`,
          description: "The user role name",
          options: constants.ROLE_OPTIONS,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
  /*
  Example query:

  mutation createNewPipe{
    createPipe(
        input: {name: "UsersPipe", organization_id: 300455771 } ) {
            pipe{id name}
      }
  }
  */

    const variables = {
      name: this.name,
      organizationId: this.organization,
      icon: this.icon,
    };

    if (this.phases?.length > 0) {
      const phases = [];
      for (const phase of this.phases) {
        phases.push({
          name: phase,
          done: this[phase],
        });
      }
      variables.phases = phases;
    }

    if (this.members?.length > 0) {
      const members = [];
      for (const member of this.members) {
        members.push({
          role_name: this[member.value],
          user_id: member.value,
        });
      }
      variables.members = members;
    }

    const response = await this.pipefy.createPipe(variables);
    $.export("$summary", "Successfully created pipe");
    return response;
  },
};

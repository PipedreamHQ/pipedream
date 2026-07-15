import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";
import {
  RTR_DEFAULT_SESSION_TIMEOUT,
  RTR_MAX_SESSION_TIMEOUT,
  RTR_BASE_COMMANDS,
} from "../../common/constants.mjs";

export default {
  key: "crowdstrike_falcon-run-rtr-command",
  name: "Run RTR Command",
  description: "Initiate a Real-Time Response (RTR) session on a host and execute a read-only responder command. Calls POST /real-time-response/entities/sessions/v1 to open the session, then POST /real-time-response/entities/command/v1 to run the command; returns the session_id and cloud_request_id. Use **Get RTR Command Status** with the returned cloud_request_id to fetch results. Requires an RTR entitlement. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/real-time-response/#rtr_executecommand).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crowdstrikeFalcon,
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "Device ID (aid) to open the RTR session against. Run **Search Hosts** to obtain it.",
    },
    baseCommand: {
      type: "string",
      label: "Base Command",
      description: "The RTR base command to run, e.g. `ls`, `ps`, `cat`. Must match the leading token of Command String.",
      options: RTR_BASE_COMMANDS,
    },
    commandString: {
      type: "string",
      label: "Command String",
      description: "The full command line including arguments, e.g. `ls C:\\Windows`.",
    },
    queueOffline: {
      type: "boolean",
      label: "Queue Offline",
      description: "If true, queue the command for delivery when an offline host reconnects. Default: false.",
      optional: true,
      default: false,
    },
    timeout: {
      type: "integer",
      label: "Session Timeout (seconds)",
      description: `Session timeout in seconds (1-${RTR_MAX_SESSION_TIMEOUT}). Default: ${RTR_DEFAULT_SESSION_TIMEOUT}.`,
      optional: true,
      min: 1,
      max: RTR_MAX_SESSION_TIMEOUT,
    },
    persist: {
      type: "boolean",
      label: "Persist",
      description: "Flag indicating if this command should be executed when the host returns to service.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    // Step 1: Initiate an RTR session on the target host.
    const sessionResponse = await this.crowdstrikeFalcon.initRtrSession({
      $,
      data: {
        device_id: this.deviceId,
        queue_offline: this.queueOffline,
        timeout: this.timeout ?? RTR_DEFAULT_SESSION_TIMEOUT,
      },
    });

    const sessionId = sessionResponse.resources?.[0]?.session_id;
    if (!sessionId) {
      throw new Error(`Failed to initiate RTR session: ${JSON.stringify(sessionResponse)}`);
    }

    // Step 2: Execute the command within the session.
    const commandResponse = await this.crowdstrikeFalcon.executeRtrCommand({
      $,
      data: {
        base_command: this.baseCommand,
        command_string: this.commandString,
        session_id: sessionId,
        persist: this.persist,
      },
    });

    const cloudRequestId = commandResponse.resources?.[0]?.cloud_request_id;
    if (!cloudRequestId) {
      throw new Error(`Failed to dispatch RTR command: ${JSON.stringify(commandResponse)}`);
    }

    $.export("$summary", `RTR command '${this.baseCommand}' dispatched on device ${this.deviceId} (session: ${sessionId})`);

    return {
      session_id: sessionId,
      cloud_request_id: cloudRequestId,
      session_response: sessionResponse,
      command_response: commandResponse,
    };
  },
};

import common from "../common/common-polling.mjs";
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";

export default {
  ...common,
  key: "zoho_desk-new-ticket-attachment",
  name: "New Ticket Attachment",
  description: "Emit new event when a new ticket attachment is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#TicketAttachments#TicketAttachments_Listticketattachments)",
  type: "source",
  version: "0.1.1",
  dedupe: "unique",
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.zohoDesk,
        "orgId",
      ],
    },
    ticketId: {
      propDefinition: [
        common.props.zohoDesk,
        "ticketId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload attachment to your File Stash and emit temporary download link to the file. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoDesk.getTicketAttachments;
    },
    getResourceFnArgs() {
      return {
        ticketId: this.ticketId,
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortBy: "createdTime",
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.createdTime) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.createdTime),
        summary: `Ticket Attachment ID ${resource.id}`,
      };
    },
    async stashFile(resource) {
      const response = await this.zohoDesk.makeRequest({
        url: resource.href,
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response);
      const filepath = `${resource.id}/${resource.name}`;
      const type = await fileTypeFromBuffer(buffer);
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        type?.mime,
        buffer.length,
      );
      return await file.withoutPutUrl().withGetUrl();
    },
    async processEvent(resource) {
      if (this.includeLink) {
        resource.file = await this.stashFile(resource);
      }
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
};

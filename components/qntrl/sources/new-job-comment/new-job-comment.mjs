import qntrl from "../../qntrl.app.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "qntrl-new-job-comment",
  name: "New Comment Posted",
  description: "Emit new event when a comment is posted to a job. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=GetAllComments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  props: {
    ...common.props,
    jobId: {
      propDefinition: [
        qntrl,
        "jobId",
        (({ orgId }) => ({
          orgId,
        })),
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary({ comment }) {
      return `New Comment: "${comment.length > 40
        ? `${comment.slice(0, 40)}...`
        : comment}"`;
    },
    sortItems(a, b) {
      // eslint-disable-next-line max-len
      return new Date(Number(a.created_time)).valueOf() - new Date(Number(b.created_time)).valueOf();
    },
    getItems() {
      const {
        orgId, jobId,
      } = this;
      return this.app.listJobComments({
        orgId,
        jobId,
      });
    },
    getItemId(item) {
      return item.comment_id;
    },
  },
};

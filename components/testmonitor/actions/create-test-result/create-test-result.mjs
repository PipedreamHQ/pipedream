import {
  getFileStreamAndMetadata, ConfigurationError,
} from "@pipedream/platform";
import FormData from "form-data";
import { parseObject } from "../../common/utils.mjs";
import testmonitor from "../../testmonitor.app.mjs";

export default {
  key: "testmonitor-create-test-result",
  name: "Create Test Result",
  description: "Create a new test result. [See the documentation](https://docs.testmonitor.com/#tag/Test-Results/operation/PostTestResult)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    testmonitor,
    projectId: {
      propDefinition: [
        testmonitor,
        "projectId",
      ],
    },
    testCaseId: {
      propDefinition: [
        testmonitor,
        "testCaseId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    testRunId: {
      propDefinition: [
        testmonitor,
        "testRunId",
        ({
          projectId, testCaseId,
        }) => ({
          projectId,
          testCaseId,
        }),
      ],
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "Denotes if this test result is marked as draft.",
      reloadProps: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "A list of attachment files. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
      hidden: true,
      optional: true,
    },
    testResultStatusId: {
      propDefinition: [
        testmonitor,
        "testResultStatusId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      hidden: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the test result.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps(props) {
    if (!this.draft) {
      props.attachments.hidden = false;
      props.testResultStatusId.hidden = false;
    }
    return {};
  },
  async run({ $ }) {
    let attachmentData = [];
    if (this.attachments) {
      try {
        const files = parseObject(this.attachments);
        for (const file of files) {
          const {
            stream, metadata,
          } = await getFileStreamAndMetadata(file);
          const data = new FormData();
          data.append("file", stream, {
            contentType: metadata.contentType,
            knownLength: metadata.size,
            filename: metadata.name,
          });
          attachmentData.push(data);
        }
      } catch (e) {
        throw new ConfigurationError(`Error accessing attachments: ${e.message}`);
      }
    }

    let testResultId;
    let summary = "";
    try {
      const response = await this.testmonitor.createTestResult({
        $,
        data: {
          test_case_id: this.testCaseId,
          test_run_id: this.testRunId,
          description: this.description,
          draft: true,
        },
      });
      testResultId = response.data.id;

      if (this.attachments) {
        try {
          for (const data of attachmentData) {
            await this.testmonitor.uploadAttachment({
              $,
              testResultId,
              data,
              headers: data.getHeaders(),
            });
          }
        } catch (e) {
          throw new ConfigurationError(`Error uploading attachments: ${e.message}`);
        }
      }

      const updateResponse = await this.testmonitor.updateTestResult({
        $,
        testResultId,
        data: {
          draft: this.draft,
          test_result_status_id: this.testResultStatusId,
        },
      });

      $.export("$summary", `Successfully created test result with Id: ${testResultId}${summary}`);
      return updateResponse;
    } catch (e) {
      throw new ConfigurationError((e.response.status === 400)
        ? "It seems that there is already a test with this configuration!"
        : e.response.data.message);
    }
  },
};

/* eslint-disable no-unused-vars */
import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import {
  DOUBLE_SIDED_OPTIONS,
  IDEAL_ENVELOPE_OPTIONS,
  POSTAGE_SERVICE_OPTIONS,
  SPLITTING_METHOD_OPTIONS,
} from "../../common/constants.mjs";
import {
  camelCaseToSnakeCase, parseObject,
} from "../../common/utils.mjs";
import intelliprint from "../../intelliprint.app.mjs";

export default {
  key: "intelliprint-create-a-print-job",
  name: "Create a Print Job",
  description: "Creates a new print job in the Intelliprint API. [See the documentation](https://api-docs.intelliprint.net/?_gl=1*19r3k2k*_gcl_au*MTU2NDU2MDgzMS4xNzY0MDIwNDQx#print_jobs-create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    intelliprint,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "An user-provided reference for this Print Job.",
      optional: true,
    },
    confirmed: {
      type: "boolean",
      label: "Confirmed",
      description: "Whether to confirm this Print Job immediately, or to leave it as a draft.",
      optional: true,
    },
    testmode: {
      type: "boolean",
      label: "Test Mode",
      description: "Whether to mark this Print Job as a test.",
      optional: true,
    },
    splittingMethod: {
      type: "string",
      label: "Splitting Method",
      description: "The method to use to split the Print Job into multiple Print Jobs.",
      options: SPLITTING_METHOD_OPTIONS,
      optional: true,
    },
    splitOnPhrase: {
      type: "string",
      label: "Split On Phrase",
      description: "The word or phrase to split letters using. Only used when **Splitting Method** is set to `split_on_phrase`.",
      optional: true,
    },
    splitOnPage: {
      type: "integer",
      label: "Split On Page",
      description: "The number of pages each letter should be. Only used when **Splitting Method** is set to `split_on_page`.",
      optional: true,
    },
    doubleSided: {
      type: "string",
      label: "Double Sided",
      description: "Whether to print these letters double sided.",
      options: DOUBLE_SIDED_OPTIONS,
      optional: true,
    },
    doubleSidedSpecificPages: {
      type: "string",
      label: "Double Sided Specific Pages",
      description: "The array of pages to print double sided. Only used when **Double Sided** is set to `mixed`. Example: **1-3,6-7**.",
      optional: true,
    },
    premiumQuality: {
      type: "boolean",
      label: "Premium Quality",
      description: "Whether to print these letters in premium quality.",
      optional: true,
    },
    postageService: {
      type: "string",
      label: "Postage Service",
      description: "The postage service to use for this Print Job.",
      options: POSTAGE_SERVICE_OPTIONS,
      optional: true,
    },
    idealEnvelope: {
      type: "string",
      label: "Ideal Envelope",
      description: "The ideal envelope size for these letters.",
      options: IDEAL_ENVELOPE_OPTIONS,
      optional: true,
    },
    mailDate: {
      type: "string",
      label: "Mail Date",
      description: "The date to send this letter out on. Format: **YYYY-MM-DD**",
      optional: true,
    },
    backgroundFirstPage: {
      type: "string",
      label: "Background First Page",
      description: "The ID of the Background to apply to the first page of these letters.",
      optional: true,
    },
    backgroundOtherPages: {
      type: "string",
      label: "Background Other Pages",
      description: "The ID of the Background to apply to the other pages of these letters.",
      optional: true,
    },
    confidential: {
      type: "boolean",
      label: "Confidential",
      description: "Whether to mark letters of this Print Job as confidential.",
      optional: true,
    },
    removeLettersWithPhrase: {
      type: "string",
      label: "Remove Letters With Phrase",
      description: "Remove letter objects that have this phrase in their content.",
      optional: true,
    },
    removeLettersSeries: {
      type: "string[]",
      label: "Remove Letters Series",
      description: "An array of letters' indexes that have been removed.",
      optional: true,
    },
    nudgeX: {
      type: "integer",
      label: "Nudge X",
      description: "What amount in mm to move the first page of each letter horizontally. A positive number moves the page right, a negative number moves the page left.",
      optional: true,
    },
    nudgeY: {
      type: "integer",
      label: "Nudge Y",
      description: "What amount in mm to move the first page of each letter vertically. A positive number moves the page down, a negative number moves the page up.",
      optional: true,
    },
    confirmationEmail: {
      type: "boolean",
      label: "Confirmation Email",
      description: "Whether a confirmation email should be sent to the user or account's email address when this letter is confirmed.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A key-value object for storing any information you want to along with this Print Job.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: false,
    },
  },
  async run({ $ }) {

    try {
      const {
        intelliprint,
        confirmed,
        testmode,
        filePath,
        syncDir,
        splittingMethod,
        splitOnPhrase,
        splitOnPage,
        doubleSided,
        doubleSidedSpecificPages,
        premiumQuality,
        postageService,
        idealEnvelope,
        mailDate,
        backgroundFirstPage,
        backgroundOtherPages,
        nudgeX,
        nudgeY,
        confidential,
        removeLettersWithPhrase,
        removeLettersSeries,
        confirmationEmail,
        ...data
      } = this;

      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(filePath);

      const formData = new FormData();
      formData.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      if (confirmed) formData.append("confirmed", `${confirmed}`);
      if (testmode) formData.append("testmode", `${testmode}`);
      if (doubleSided) formData.append("printing.double_sided", doubleSided);
      if (doubleSidedSpecificPages) formData.append("printing.double_sided_specific_pages", doubleSidedSpecificPages);
      if (premiumQuality) formData.append("printing.premium_quality", `${premiumQuality}`);
      if (splittingMethod) formData.append("splitting.method", splittingMethod);
      if (splitOnPhrase) formData.append("splitting.phrase", splitOnPhrase);
      if (splitOnPage) formData.append("splitting.pages", splitOnPage);
      if (postageService) formData.append("postage.service", postageService);
      if (idealEnvelope) formData.append("postage.ideal_envelope", idealEnvelope);
      if (mailDate) formData.append("postage.mail_date", Date.parse(mailDate) / 1000);
      if (backgroundFirstPage) formData.append("background.first_page", backgroundFirstPage);
      if (backgroundOtherPages) formData.append("background.other_pages", backgroundOtherPages);
      if (nudgeX) formData.append("nudge.x", nudgeX);
      if (nudgeY) formData.append("nudge.y", nudgeY);
      if (confidential) formData.append("confidential", `${confidential}`);
      if (removeLettersWithPhrase) formData.append("remove_letters.with_phrase", removeLettersWithPhrase);
      if (removeLettersSeries) formData.append("remove_letters.series", JSON.stringify(parseObject(removeLettersSeries)));
      if (confirmationEmail) formData.append("confirmation_email", `${confirmationEmail}`);
      for (const [
        key,
        value,
      ] of Object.entries(data)) {
        formData.append(camelCaseToSnakeCase(key), `${value}`);
      }

      const response = await intelliprint.createPrintJob({
        $,
        data: formData,
        headers: formData.getHeaders(),
      });

      $.export("$summary", `Successfully created print job with ID: ${response.id}`);
      return response;
    } catch (error) {
      console.log("error: ", error);

      throw new ConfigurationError(`Error creating print job: ${error.response.data.error.message}`);
    }
  },
};

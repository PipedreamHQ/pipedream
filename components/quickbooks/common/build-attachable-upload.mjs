/**
 * Build the multipart body required by the QuickBooks attachment upload API.
 *
 * @param {object} options - Upload parameters.
 * @param {string} options.boundary - Multipart boundary.
 * @param {string} options.contentType - Valid file MIME type.
 * @param {string|number} options.entityId - QuickBooks entity ID.
 * @param {string} options.entityType - QuickBooks entity type.
 * @param {Buffer} options.file - File bytes.
 * @param {string} options.fileName - Safe attachment filename.
 * @returns {{body: Buffer, contentType: string}} Multipart request payload.
 */
export function buildAttachableUpload({
  boundary,
  contentType,
  entityId,
  entityType,
  file,
  fileName,
}) {
  if (typeof fileName !== "string" || !fileName || /[\\\r\n"]/u.test(fileName)) {
    throw new TypeError("File name must be non-empty and may not contain backslashes, quotes, or line breaks.");
  }
  if (typeof contentType !== "string" || !/^[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]*\/[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]*$/u.test(contentType)) {
    throw new TypeError("Content type must be a valid MIME type.");
  }

  const metadata = JSON.stringify({
    AttachableRef: [
      {
        EntityRef: {
          type: entityType,
          value: String(entityId),
        },
      },
    ],
    FileName: fileName,
    ContentType: contentType,
  });

  const prefix = Buffer.from([
    `--${boundary}`,
    "Content-Disposition: form-data; name=\"file_metadata_01\"",
    "Content-Type: application/json; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    metadata,
    `--${boundary}`,
    `Content-Disposition: form-data; name="file_content_01"; filename="${fileName}"`,
    `Content-Type: ${contentType}`,
    "Content-Transfer-Encoding: binary",
    "",
    "",
  ].join("\r\n"), "utf8");
  const suffix = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");

  return {
    body: Buffer.concat([
      prefix,
      file,
      suffix,
    ]),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

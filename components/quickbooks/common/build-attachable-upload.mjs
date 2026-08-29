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

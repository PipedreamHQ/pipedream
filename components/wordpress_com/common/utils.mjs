import { basename } from "path";
import { get } from "https";
import FormData from "form-data";

/**
 * Prepares a multipart/form-data payload for uploading media to WordPress.com.
 * Fetches the media file from a given URL, wraps it in a FormData object*/

export async function prepareMediaUpload(mediaUrl, fields = {}) {

  const {
    title, caption, description,
  } = fields;

  // Extract the filename from the URL (e.g., "mypicture.jpg")
  const filename = basename(new URL(mediaUrl).pathname || "upload.jpg");

  // Fetch the media as a stream and its content type
  const {
    stream, contentType,
  } = await fetchStreamWithHeaders(mediaUrl);

  // WordPress.com expects a multipart/form-data upload
  const form = new FormData();

  // Attach the media file to the form under the field name "media[]"
  form.append("media[]", stream, {
    filename,
    contentType: contentType || "application/octet-stream",
  });

  // Attach optional metadata fields if provided
  if (title) form.append("title", title);
  if (caption) form.append("caption", caption);
  if (description) form.append("description", description);

  return form;
};

/**
 * Fetches a remote media file as a readable stream, including its content type.
 * Sends a basic GET request while mimicking a browser to avoid blocks from some servers.*/
function fetchStreamWithHeaders(url) {
  return new Promise((resolve, reject) => {
    // Send a GET request with a fake browser User-Agent
    get(
      url,
      {
        headers: {
          // Mimick a browser just in case . Some site refuse to give media to servers directly
          "User-Agent": "Mozilla/5.0 (Node.js FormUploader)",
        },
      },
      // Callback triggered when the response starts (event-driven)
      (result) => {
        if (result.statusCode !== 200) {
          reject(new Error(`Failed to fetch media. Status: ${result.statusCode}`));
        } else {
          resolve({
            stream: result, // The response body is a readable stream
            contentType: result.headers["content-type"], // Extract MIME type
          });
        }
      },
    ).on("error", reject); // Call regect on error.
  });
}

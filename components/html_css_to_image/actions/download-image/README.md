# Overview

Download an image or PDF so a later workflow step can upload it or send it as an attachment. The action saves the file in Pipedream's `/tmp` directory and returns its path and file details.

# Getting Started

1. Add **Download Image** after an image creation or signed URL step and select your connected HTML/CSS to Image account.
2. Set **Image URL** to the `url` returned by **Create Image From HTML**, **Create Image From URL**, **Create Image From Template**, or either signed URL action.
3. Optionally set **File Name**, such as `invoice.pdf`. Enter a filename without a directory path. If left empty, the action generates a unique filename and chooses an extension from the response or URL.
4. Run the step.
5. Use the returned `filePath` in a later step that accepts a file, such as an upload or email attachment action.

The output includes:

| Field | Value |
| --- | --- |
| `filePath` | The downloaded file's path under `/tmp`. |
| `fileName` | The filename, including its extension. |
| `contentType` | The response's content type, such as `image/png` or `application/pdf`, when provided. |
| `size` | The file size in bytes. |

Downloading a signed URL requests rendering and may use image credits. Generating the URL in an earlier step does not render the image.

# Troubleshooting

Use a complete `https://hcti.io/` URL. This action requires HTTPS and the exact hostname `hcti.io` on its default HTTPS port, including for redirects. Custom storage URLs and other hosts are not supported. Pass signed URLs unchanged so their signatures remain valid.

This action downloads the format served by the URL. Choose **Format** in the earlier creation or signing step to get a PNG, JPG, WebP, or PDF. Naming a PNG file `invoice.pdf` does not convert it to a PDF.

PNG is the default. For an image returned by a creation action, you can change the URL's extension to `.jpg`, `.webp`, or `.pdf` before downloading. For a signed URL, generate a new URL with the desired **Format** instead of editing it.

The download uses the URL's own authorization. It does not send your connected account's API ID or API Key to the download URL.

See the [image URL documentation](https://docs.htmlcsstoimage.com/getting-started/using-the-api/#getting-an-image) and [signed URL documentation](https://docs.htmlcsstoimage.com/getting-started/create-and-render/).

# Overview

Generate a signed URL that takes a screenshot of a webpage when requested. This action only generates the URL. It does not make an API request, render an image, or use image credits.

# Getting Started

1. Connect your HTML/CSS to Image account using the **API ID** and **API Key** from your [dashboard](https://htmlcsstoimage.com/dashboard/api-keys).
2. Set **URL** to the webpage you want to capture, such as `https://example.com`.
3. Choose a **Format** and any rendering options you need. For example, enable **Full Screen** to capture the full height of the webpage.
4. Run the step.

**Format** defaults to PNG and only selects the format requested by the returned URL. It does not limit the screenshot to that format. To request JPG, WebP, or PDF instead, generate a new signed URL with that **Format**. Editing an existing signed URL invalidates its signature.

The output contains only `url`. The image is generated when this signed URL is first requested by a browser, email client, or another workflow step. Pass it to **Download Image** if you need a file. Requesting the URL may use image credits and requires `images:create` permission.

Your API Key is not included in the URL. Anyone with the signed URL can request the screenshot it authorizes. If you set **Webpage Headers**, their values are included in the URL too.

Sharing a signed URL with authentication headers also shares the webpage credentials. Recipients can read and reuse them outside HTML/CSS to Image. Use **Create Image From URL** when those credentials must remain private, then share the returned image URL.

# Troubleshooting

Pass the signed URL unchanged. Changing its query parameters or their encoding invalidates the signature.

The webpage must be accessible to HTML/CSS to Image. For pages that require authentication, use **Webpage Headers** with the credentials expected by that website.

Use **Create Image From URL** if you need an image ID, want to create the image during this workflow step, or need custom PDF page size, margins, or scale.

See the [signed URL documentation](https://docs.htmlcsstoimage.com/getting-started/create-and-render/).

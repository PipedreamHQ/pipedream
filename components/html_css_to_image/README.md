# Overview

Create images and PDFs from HTML/CSS, webpage URLs, or saved templates in your Pipedream workflows. Use the returned URL in a website or email, or download the file for an upload or attachment step. You can also generate signed URLs for images that render on demand.

# Getting Started

Connect your account using the **API ID** and **API Key** from your [HTML/CSS to Image dashboard](https://htmlcsstoimage.com/dashboard/api-keys). Add an action to your workflow and use content from earlier steps to populate its inputs.

See our [Pipedream integration guide](https://docs.htmlcsstoimage.com/integrations/pipedream/) for setup and API documentation.

## Actions

- **Create Image From HTML** renders an HTML snippet or document with optional CSS and Google Fonts.
- **Create Image From URL** captures a webpage with optional full-page capture, injected CSS, cookie banner blocking, and custom webpage headers.
- **List Templates** finds saved template IDs and their latest versions, retrieving additional pages up to the requested maximum. Requires `templates:read` permission.
- **Create Image From Template** renders a saved template with dynamic values. Pass the `id` from **List Templates** and an object of variables such as `{"title": "Hello", "price": 19.99, "featured": true}`. Omit Template Version to use the latest version, or provide a version to pin it.
- **Generate Signed URL for Template** generates a URL locally for a saved template and dynamic values.
- **Generate Signed URL for Webpage** generates a URL locally for a webpage screenshot with supported rendering options.
- **Delete Image** permanently deletes one image by ID and clears its cached copies. Requires `images:delete` permission and cannot be undone.
- **Download Image** streams an image or PDF URL to a file in the workflow's `/tmp` directory and returns the file path and metadata for later steps.

Creation actions return the API response, including the generated image's `id` and `url`. They require `images:create` permission. Template creation does not require `templates:read` if you already know the template ID.

## Signed URLs and on-demand rendering

The signed URL actions return only `{ "url": "..." }`. They do not create or render an image, call the API, download a preview, or consume image credits. The image is generated when the URL is first requested, for example by a browser, email client, or later download step. The success summary says: "Signed URL generated. Image rendering has not been requested."

Signing uses the official TypeScript client's helpers with credentials from the connected account. The API key remains inside the action; the returned URL contains the signed parameters and authentication token. Anyone with that URL can request the image it authorizes. Custom webpage header values are also embedded in the URL.

The webpage signing action offers only controls supported by the pinned signing helper. PDF URL format is supported, but custom PDF layout, deduplication duration, request override rules, and Twemoji controls are excluded. Use **Create Image From URL** for custom PDF layout, deduplication, Twemoji settings, or a create-then-fetch workflow.

## Downloading and deleting images

Pass a creation or signing action's `url` to **Download Image**. The action preserves signed query strings exactly, including repeated parameters. Requesting a signed URL triggers rendering and may consume image credits. Downloads use the URL's own authorization and do not send your connected account's API credentials to the destination.

Downloads require HTTPS and the exact hostname `hcti.io` on its default HTTPS port. Redirects must also use HTTPS and stay on that host. Custom storage URLs and other hosts are not supported.

The output contains `filePath`, `fileName`, `contentType`, and `size` in bytes. Use `filePath` in a later upload or attachment action. Files are saved in separate directories under `/tmp` so repeated filenames do not overwrite one another. An optional File Name can be supplied, such as `invoice.pdf`; otherwise the action generates a unique filename with an extension inferred from the response or URL. Failed downloads remove partial files.

Pass a creation action's `id` to **Delete Image**. Deletion requires an image ID, not a URL; generating a signed URL alone does not provide an image ID. When the API accepts deletion, the action returns `{ "success": true, "id": "..." }`. Deletion removes the image and cached copies permanently.

## Rendering options

The HTML and URL actions offer optional controls for cropping, viewport size, pixel ratio, timing, transparent backgrounds, color scheme, timezone, mobile emulation, emoji handling, deduplication, and PDF layout. Leave optional controls unset to preserve the API defaults. Viewport width and height must be supplied together, as must the jumbo maximum dimensions.

**Format** defaults to PNG. Choose `png`, `jpg`, `webp`, or `pdf` to set the returned URL's extension. This only affects the returned URL; it does not limit the formats available for that image. For example, you can request a created image's `.png` URL as `.jpg`, `.webp`, or `.pdf` by changing the extension. Creation returns a URL and metadata, not downloaded file content.

For signed URLs, choose **Format** when generating the URL. To request another format, generate a new signed URL with that format. Editing an existing signed URL invalidates its signature.

For a PDF invoice, set Format to `pdf`, PDF Page Width to `8.5in`, PDF Page Height to `11in`, and PDF Margins to `["0.5in", "0.5in", "0.5in", "0.5in"]`. Margins are ordered top, right, bottom, left. Dimensions accept `px`, `in`, `cm`, and `mm`. PDF Scale accepts fractional values from `0.1` to `2`.

Google Fonts accepts an array of family names, such as `["Roboto", "Open Sans"]`. Webpage Headers accepts an object such as `{"Accept-Language": "en-US"}`. These headers are sent to the webpage origin; HTML/CSS to Image API credentials come from the connected account. Additional Header Origins explicitly allows other origins to receive the webpage headers.

See the [API reference](https://docs.htmlcsstoimage.com/getting-started/using-the-api/), [PDF options](https://docs.htmlcsstoimage.com/parameters/pdf_options/), and [template documentation](https://docs.htmlcsstoimage.com/getting-started/templates/).

# Example Use Cases

- **Invoices:** Use order details from Shopify to populate an HTML/CSS invoice or saved template. Choose PDF output, then download the file for an email attachment or Google Drive upload.

- **Social sharing images:** When a blog post is published, pass its title and featured image to a saved template and use the generated image in a social post.

- **Personalized emails:** Generate a signed template URL with a recipient's name or account details. Use the URL in the email so the image renders when requested.

# Development

## Local verification

With the component dependencies installed, run these commands from the repository root:

```sh
npm test --prefix components/html_css_to_image
npx eslint components/html_css_to_image
```

The tests check that generated files match the pinned client, then use Pipedream's HTTP helper with an in-memory adapter to check request serialization, authentication, input validation, response compatibility, template pagination, deletion, and streamed downloads. Signed URL tests verify signatures and confirm that signing performs no HTTP requests. Download tests verify exact signed queries, file contents, and failure cleanup. Tests do not make API calls, delete real images, or consume image credits. Test the actions in a Pipedream workflow with a connected account before publishing.

## Keeping the client fields in sync

`common/generated-props.mjs` is generated from the request declarations and JSDoc in the exact `@html-css-to-image/client` version pinned in this component's `dependencies`. It supplies input types, descriptions, required fields, enum choices, action field lists, and mappings to API parameter names. Published actions use the checked-in generated module, Pipedream's HTTP helper for API calls, and the official client for local signing. TypeScript is a development dependency only.

To update the integration after a client release:

1. Update the exact client version in this component's `package.json` and install dependencies to update `pnpm-lock.yaml`.
2. Run `npm run generate:client --prefix components/html_css_to_image` from the repository root.
3. Run the verification commands above, review the generated changes, and bump the affected action and package versions.
4. Commit the generated module alongside the dependency update.

Do not edit the generated module by hand. The test command runs `check:generated` and fails if the module differs from the pinned client. New unsupported structured types also fail generation instead of silently disappearing from the integration.

Pipedream labels, examples, and platform-specific input hints live in the generator. Font encoding, PDF dimension handling, and validation live in `common/utils.mjs`. Action descriptions and template listing remain handwritten. Nested PDF options have dedicated controls; request override rules are intentionally excluded from this first update.

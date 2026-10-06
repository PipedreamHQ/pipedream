# Overview

Generate a signed URL for a saved template and its variables. Use it when an image should render on demand, such as a personalized image in an email or a social sharing image.

This action only generates the URL. It does not make an API request, render an image, or use image credits. The image is generated when the URL is first requested.

# Getting Started

1. Connect your HTML/CSS to Image account using the **API ID** and **API Key** from your [dashboard](https://htmlcsstoimage.com/dashboard/api-keys).
2. Enter the **Template ID**. Use **List Templates** if you need to find it.
3. Set **Template Values** to an object whose keys match the variables in your template. For example:

   ```json
   {
     "title": "Hello, Freddy",
     "avatar_url": "https://example.com/avatar.png"
   }
   ```

4. Leave **Template Version** empty to use the latest version, or enter a specific version.
5. Choose a **Format** if needed, then run the step.

**Format** defaults to PNG and only selects the format requested by the returned URL. It does not limit the template to that format. To request JPG, WebP, or PDF instead, generate a new signed URL with that **Format**. Editing an existing signed URL invalidates its signature.

The output contains only `url`. Use it in an image tag or pass it to **Download Image** when you need the file. Opening or downloading the URL requests rendering and may use image credits. Rendering requires `images:create` permission.

Your API Key is not included in the URL. Anyone with the signed URL can request the image it authorizes.

# Troubleshooting

Pass the signed URL unchanged. Changing its query parameters or their encoding invalidates the signature.

If variables are missing, check their names against the template and pass **Template Values** as an object.

Generating a signed URL does not return an image ID. If you need an ID or want to create the image during this workflow step, use **Create Image From Template**.

See the [signed template URL documentation](https://docs.htmlcsstoimage.com/getting-started/create-and-render/#creating-a-templated-image-url).

# Overview

Create an image or PDF from a saved HTML/CSS to Image template. Pass values for the template's variables, such as a title, price, or avatar URL. The action returns the generated image's URL and metadata.

# Getting Started

1. Connect your HTML/CSS to Image account using the **API ID** and **API Key** from your [dashboard](https://htmlcsstoimage.com/dashboard/api-keys).
2. Enter the **Template ID**. Use **List Templates** to find the ID of an existing template, or create one in the [Template Editor](https://htmlcsstoimage.com/dashboard).
3. Set **Template Values** to an object whose keys match the variables in your template. For example, a template containing `{{title}}` and `{{price}}` can use:

   ```json
   {
     "title": "New release",
     "price": 19.99
   }
   ```

4. Leave **Template Version** empty to use the latest version, or enter a version to use that specific design.
5. Choose a **Format** if needed, then run the step.

**Format** defaults to PNG and only sets the returned URL's extension. It does not limit the formats available for the image. Change a created image URL's extension to `.jpg`, `.webp`, or `.pdf` to request the same image in another format.

Use the returned `url` directly in a website or email. If a later step needs a file, pass it to **Download Image**. The returned `id` can be used with **Delete Image**.

Creating an image uses image credits and requires `images:create` permission. You do not need `templates:read` permission if you already know the template ID.

# Troubleshooting

If a variable is missing from the image, check that its name in **Template Values** matches the name in the template. Pass an object, rather than a string containing JSON.

If the template cannot be found, check that it belongs to the connected account and that the requested version exists.

See the [template documentation](https://docs.htmlcsstoimage.com/getting-started/templates/#creating-an-image-with-a-template) for more examples.

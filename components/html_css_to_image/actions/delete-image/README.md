# Overview

Permanently delete an image from HTML/CSS to Image and clear its cached copies. All data and copies of the image are deleted. This cannot be undone.

# Getting Started

1. Connect your HTML/CSS to Image account using the **API ID** and **API Key** from your [dashboard](https://htmlcsstoimage.com/dashboard/api-keys).
2. Set **Image ID** to the `id` returned by **Create Image From HTML**, **Create Image From URL**, or **Create Image From Template**.
3. Run the step.

When the API accepts the deletion, the action returns `success: true` and the image's `id`. Your API key needs `images:delete` permission.

# Troubleshooting

Enter the image ID, such as `c7db3b3c-59b3-4c13-987b-4ea8217899cf`, rather than the full image URL. Generating a signed URL alone does not provide an image ID.

If deletion fails, check that the image belongs to the connected account and that your API key has `images:delete` permission.

See the [image deletion documentation](https://docs.htmlcsstoimage.com/getting-started/using-the-api/#deleting-an-image).

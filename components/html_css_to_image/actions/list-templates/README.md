# Overview

Find saved templates in your HTML/CSS to Image account. The action returns an array with each template's ID, name, and latest version. Use it to find a template for **Create Image From Template** or **Generate Signed URL for Template**.

# Getting Started

1. Connect your HTML/CSS to Image account using the **API ID** and **API Key** from your [dashboard](https://htmlcsstoimage.com/dashboard/api-keys).
2. Set **Maximum Results** to the number of templates you want to retrieve. The default is `100`.
3. Run the step and find the template you want in the returned array.
4. Use that template's `id` as **Template ID** in a later action. Use its `version` as **Template Version** if you want to pin the version.

The action retrieves additional pages as needed, up to **Maximum Results**. Listing templates does not create images or use image credits.

# Troubleshooting

Your API key needs `templates:read` permission. If you receive a permission error, check the key's permissions in your dashboard.

If a template is missing, check that you connected the correct account and that **Maximum Results** is large enough to include it.

See the [template listing documentation](https://docs.htmlcsstoimage.com/getting-started/templates/#listing-your-templates).

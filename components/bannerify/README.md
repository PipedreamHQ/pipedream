# Overview

Bannerify generates production-ready images and PDFs from reusable templates. Use Bannerify in Pipedream to render marketing visuals, ecommerce banners, invoices, labels, and personalized files from workflow data.

# Example Use Cases

- Render a personalized image when a new form submission arrives.
- Generate a PDF invoice from order data.
- Create ecommerce or social media images from rows in a spreadsheet.

# Getting Started

Create a Bannerify project API key in the Bannerify dashboard, then connect Bannerify in Pipedream with that key. Add a Render Image or Render PDF step, enter a template ID, and pass optional modifications as JSON.

# Troubleshooting

Make sure the API key belongs to the project that owns the template ID. If modifications fail, validate that the JSON is either an object shorthand like `{"headline":"Hello"}` or the Bannerify modifications array format.

# Overview

The imgix API offers dynamic image processing and optimization. You can manipulate images on-the-fly by changing query parameters in the image URL, enabling a myriad of transformations like resizing, cropping, adjusting quality, format conversion, and applying filters. Integrating imgix with Pipedream allows you to automate workflows that involve image manipulation, optimization for different devices and contexts, and the dynamic delivery of images.

# Example Use Cases

- **Automated Image Optimization for Web Content**: Trigger a Pipedream workflow when new content is posted to a CMS like WordPress. The workflow grabs the image URLs, sends them to the imgix API for optimization and compression, and updates the CMS with the optimized image URLs. This ensures faster page loads and improved SEO.

- **Dynamic Social Media Image Generation**: Set up a workflow that listens for new social media posts on platforms like Twitter or Instagram. For each new post, the workflow uses imgix to create multiple versions of attached images, optimizing them for different social media platforms and devices, then posts the images back to the respective platform.

- **On-Demand E-commerce Product Image Customization**: Create a Pipedream workflow that integrates with an e-commerce platform like Shopify. Whenever a new product is added or updated, the workflow sends product images to imgix to apply company branding, watermarks, or to generate different image styles. The processed images are then automatically associated with the product listings.

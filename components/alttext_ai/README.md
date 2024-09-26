# Overview

AltText.ai provides an API that leverages artificial intelligence to generate alternative text (alt text) for images, which is crucial for web accessibility and SEO. With AltText.ai, you can automate the process of creating descriptive, keyword-rich, and meaningful alt text for images on websites, blogs, or online stores. In Pipedream, you can create workflows that trigger on various events to send images to the AltText.ai API and receive alt text, which you can then store or apply to your content management system automatically.

# Example Use Cases

- **Automated Alt Text for E-commerce Products**: Automatically generate and update alt text for new product images uploaded to your online store. When an image is added to a specific folder in Dropbox, Pipedream can trigger a workflow to send that image to AltText.ai, receive the generated alt text, and then patch the product's details with the new alt text in a platform like Shopify.

- **Blog Post Accessibility Enhancement**: Improve the accessibility of your blog by ensuring all images have proper alt text. Each time a WordPress post is drafted, use Pipedream to send any embedded images to AltText.ai, then update the post with the received alt text before it's published.

- **SEO Optimization for Static Sites**: Optimize your static website hosted on GitHub Pages by adding alt text to images. When a new commit is pushed to a designated GitHub repository, Pipedream can trigger a workflow that checks for added or updated images, sends them to AltText.ai for alt text generation, and then commits a change to the image tags with the new alt text.

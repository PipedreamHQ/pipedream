# Leonardo AI

[Leonardo AI](https://leonardo.ai) is an AI-powered image generation platform that allows you to create stunning images, videos, and 3D models using advanced machine learning models.

## Actions

### Generate Image
Creates new images from text prompts using Leonardo AI's image generation models.

**Key Features:**
- Customizable image dimensions (256x256 to 1024x1024)
- Multiple model support
- Adjustable guidance scale and inference steps
- Batch generation (1-4 images)
- Seed support for reproducible results

### Generate Motion
Creates motion videos from static images using Leonardo AI's SVD Motion Generation.

**Key Features:**
- Converts static images to motion videos
- Adjustable motion strength
- Seed support for reproducible results

### Unzoom Image
Creates unzoom variations of existing images, expanding the scene beyond the original frame.

**Key Features:**
- Zoom out effect on existing images
- Adjustable zoom level
- Works with generated or uploaded images

### Upload Image
Uploads images to Leonardo AI for use in generations and variations.

### Upscale Image
Increases the resolution of images using Leonardo AI's Universal Upscaler.

**Key Features:**
- Multiple upscaling modes (Universal Upscaler, Real-ESRGAN)
- 2x and 4x scale factors
- High-quality image enhancement

## Usage Examples

### Basic Image Generation
```javascript
// Generate a simple image
{
  "prompt": "A beautiful sunset over mountains",
  "width": 512,
  "height": 512,
  "numImages": 1
}
```

### Advanced Image Generation
```javascript
// Generate with specific model and settings
{
  "prompt": "A cyberpunk cityscape at night",
  "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
  "width": 1024,
  "height": 1024,
  "numImages": 2,
  "guidanceScale": "10",
  "numInferenceSteps": 30,
  "seed": 12345
}
```

### Motion Generation
```javascript
// Create motion from an image
{
  "imageId": "generated-image-id-here",
  "motionStrength": "0.7",
  "seed": 54321
}
```

## API Reference

For detailed information about Leonardo AI's API, visit the [official documentation](https://docs.leonardo.ai/reference).

## Rate Limits

See the official Leonardo AI documentation for current limits.

## Support

For support with this component or Leonardo AI's API, please refer to:
- [Leonardo AI Documentation](https://docs.leonardo.ai)
- [Leonardo AI Community](https://community.leonardo.ai)
- [Pipedream Support](https://pipedream.com/support)

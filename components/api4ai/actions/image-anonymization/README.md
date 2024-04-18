# Overview

⭐️ **Image Anonymization** – is a high-Accuracy solution for automatic detection and blurring of sensitive areas in images. Cloud-based Image Anonymization API detects and blurs faces and license plates in photos, ensuring sensitive information remains unrecognizable for secure privacy protection.

![image-anonymization](https://storage.googleapis.com/api4ai-static/rapidapi/img_anonymization_0.gif)


## 🤖 Demo

Discover the Image Anonymization Web demo for free and get a feel for its capabilities before diving deeper. No registration is required: https://api4.ai/apis/image-anonymization/#demo-wrapper



# Getting started

## 🚀 Subscribe and get API key

To use Image Anonymization, start at [RapidAPI](https://rapidapi.com/), a well-known API hub. Register, subscribe to begin, and obtain an API key:

1. Register on RapidAPI and subscribe to API4AI [Image Anonymization](https://rapidapi.com/api4ai-api4ai-default/api/image-anonymization/pricing) to start.
2. Navigate to the [Image Anonymization endpoints](https://rapidapi.com/api4ai-api4ai-default/api/image-anonymization) list.
3. In the "Header Parameters" section, your API Key will be shown in the `X-RapidAPI-Key` field.


## 🛠 Parameters

### API Key

An API Key is required. Register and subscribe on RapidAPI to receive one.

### Image

Input image. Various types are accepted:
  * a **path** to a file
    ```
    /tmp/myfile.jpg
    ```
  * a **URL** to a file
    ```
    https://storage.googleapis.com/api4ai-static/samples/img-anonymization-1.jpg
    ```
  * a file's content encoded as a **base64** string
    ```
    iVBORw0KGgoAAAANSUhEUgAABdwAAAPoCAYAAADEDjzlAAEAAElEQVR4nO...
    ```
  * a file's content as a **Buffer** encoded in JSON
    ```json
    {
        "type": "Buffer",
        "data": [255,216,255,224,0,16,74,70,73,70,0,1,1,0,...]
    }
    ```
  * a file's content as an **Array** of bytes
    ```json
    [255,216,255,224,0,16,74,70,73,70,0,1,1,0,0,1,0,1,0,0,,...]
    ```

### Result image representation

By default, Image Anonymization returns a JPEG or PNG image saved to a local file storage in the `/tmp` directory with a random filename. However, in some cases, it may be more appropriate to have an alternative representation of the result image.

Here is a list of possible result image representations:
  * **path** to a file (default)
  * **URL** to a file hosted by api4ai (valid for 1 day)
  * **Base64** string with file's content
  * **Buffer** encoded in JSON with a file's content
  * **Array** of bytes with a file's content

In general, the result image representations are same as those for the `Image` option. Please refer to the `Image` section above for examples of each representation.

ℹ️ **Note**: If you choose the `URL to file` option, Image Anonymization will return a direct URL to the resulting image file hosted by API4AI. Please be informed that API4AI hosts resulting images for **one day**.

💡 **Hint**: If you wish to use a base64 encoded image as the `src` attribute value of an `<img>` HTML element somewhere in your pipeline, remember to add `data:image/jpeg;base64,` or `data:image/png;base64,` (don’t forget the comma!). before the actual base64 content. This informs the web browser that the `src` contains a JPEG or PNG image encoded as base64 rather than a URL. For more information on displaying base64 images in HTML, visit: https://www.w3docs.com/snippets/html/how-to-display-base64-images-in-html.html


### Objects to hide

By default, Image Anonymization detects and hides both faces and license plates. However, for some reasons, you may wish to hide only one type. For this purpose, you can set the `Objects to hide` option to one of the following values:
  * `Everything` – hides everything (default)
  * `Faces only` – hides faces only
  * `Licence plates only` – hides licence plates only

![verything-vs-fonly-vs-lponly](https://storage.googleapis.com/api4ai-static/rapidapi/image-anonymization/verything-vs-fonly-vs-lponly.png)

💡 **Hint**: Enabling the `Faces only` or `Licence plates only` mode may also improve overall performance.


## ↩️ Returned values

The "Image Anonymization" action returns a set of values which can be used to obtain processing results:

* `result` (string) – The resulting JPEG or PNG image, represented as base64 string or a URL to a file hosted by api4ai (valid for 1 day).
* `format` (string) – Resulting image format: `JPEG` or `PNG`. Same as input image format.
* `width` (number) – The width of the result image (same as the input image).
* `height` (number) – The height of the result image (same as the input image).
* `objects` (array) – An array of objects in the image.

### About "objects"

`objects` is an array of objects in format:

```json
{
  "class": "CLASS",
  "box": {
    "x": X,
    "y": Y,
    "w": W,
    "h": H
  }
}
```

Where:
* `CLASS` represents the object class.
* `X`, `Y`, `W`, `H` denote the bounding box dimensions.

Bounding box coordinates are normalized, meaning they range from `0.0` to `1.0`. Multiply `X` and `W` by the image's width and `Y` and `H` by the image's height to convert to pixels.

Possible classes:
* `Face`
* `License plate`

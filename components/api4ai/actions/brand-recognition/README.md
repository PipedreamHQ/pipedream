# Overview

⭐️ **Brand Recognition** – is a ready-to-Use solution for the identification of thousands of brand marks and logos within images.

Brand Recognition provides AI-powered image processing designed for analyzing the presence of brands in the pictures.

![brands](https://storage.googleapis.com/api4ai-static/rapidapi/brand_recognition_1.png)

✅ The algorithm recognizes brand marks and logos, returning a JSON with the elements found in the image. One of the core features of our technology is that it usually does not require any additional actions to begin supporting a new logo, unlike most other solutions for logo detection.  
✅ This solution provides out-of-the-box support for an extensive range of brands, encompassing a vast array of logos and trademarks. Furthermore, it incorporates advanced, sophisticated logic designed to automatically identify unknown ones.  


## 🤖 Demo

Explore the Brand Recognition Web demo for free before delving into the details (no registration is required): https://api4.ai/apis/brand-recognition#demo-wrapper



# Getting started

## 🚀 Subscribe and get API key

To use Brand Recognition, start at [RapidAPI](https://rapidapi.com/), a well-known API hub. Register, subscribe to begin, and obtain an API key:

1. Register on RapidAPI and subscribe to API4AI [Brand Recognition API](https://rapidapi.com/api4ai-api4ai-default/api/brand-recognition/pricing) to start.
2. Navigate to the [Brand Recognition API endpoints](https://rapidapi.com/api4ai-api4ai-default/api/brand-recognition) list.
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
    https://storage.googleapis.com/api4ai-static/samples/nsfw-1.jpg
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


## ↩️ Returned values

The "Brand Recognition" action returns the following value:

* `brands` (array) – An array of brands (represented as strings) identified in an input image.

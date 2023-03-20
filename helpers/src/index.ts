export * from "./sanitizedArray/index.js";
export * from "./errors/index.js";

import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const crop = {
  unit: 'px', // default, can be 'px' or '%'
  x: 130,
  y: 150,
  // width: 100,
  // height: 100
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
      src: null,
      crop: {
        unit: '%',
        width: 30,
        aspect: 16 / 9,
      },
      croppedImageUrl: null,
    };

    this.onCropChange = this.onCropChange.bind(this);
  }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        console.log(reader.result);
        this.setState((prevState) => ({
          ...prevState,
          src: reader.result,
        }));
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div>
        <Hello name={this.state.name} />
        <p>
          Start editing to see some magic happen :) <br />
          <input type="file" accept="image/*" onChange={this.onSelectFile} />
        </p>

        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
        )}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));


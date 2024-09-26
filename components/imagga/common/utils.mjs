import FormData from "form-data";
import fs from "fs";

const checkTmp = (filename) => {
  if (!filename.startsWith("/tmp")) {
    return `/tmp/${filename}`;
  }
  return filename;
};

export const prepareBatchFile =  async ({
  imageUrl, imageFile, imagga,
}) => {
  if ((!imageUrl && !imageFile) || (imageUrl && imageFile)) {
    throw new Error("You must provide either an Image URL or an Image File.");
  }

  if (imageFile) {
    const imageList = await imageFile.reduce(async (acc, cur) => {
      await delay(1000);
      const uploadId = await uploadFile({
        imageFile: cur,
        imagga,
      });

      return [
        ...await acc,
        uploadId,
      ];
    }, []);

    return imageList.map((item) => ({
      params: {
        image_upload_id: item,
      },
    }));
  } else {
    return imageUrl.map((item) => ({
      params: {
        image_url: item,
      },
    }));
  }
};

export const prepareFile = async ({
  imageUrl, imageFile, imagga,
}) => {
  if ((!imageUrl && !imageFile) || (imageUrl && imageFile)) {
    throw new Error("You must provide either an Image URL or an Image File.");
  }

  if (imageFile) {
    return {
      image_upload_id: await uploadFile({
        imageFile,
        imagga,
      }),
    };
  } else {
    return {
      image_url: imageUrl,
    };
  }
};

const uploadFile = async ({
  imageFile, imagga,
}) => {
  const formData = new FormData();
  const content = fs.createReadStream(checkTmp(imageFile));
  formData.append("image", content);

  const { result } = await imagga.uploadImage({
    data: formData,
    headers: formData.getHeaders(),
  });
  return result.upload_id;
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

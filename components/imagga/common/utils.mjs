import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export const prepareBatchFile =  async ({
  imageFile, imagga,
}) => {
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
};

export const prepareFile = async ({
  imageFile, imagga,
}) => {
  return {
    image_upload_id: await uploadFile({
      imageFile,
      imagga,
    }),
  };
};

const uploadFile = async ({
  imageFile, imagga,
}) => {
  const formData = new FormData();
  const {
    stream, metadata,
  } = await getFileStreamAndMetadata(imageFile);
  formData.append("image", stream, {
    contentType: metadata.contentType,
    knownLength: metadata.size,
    filename: metadata.name,
  });

  const { result } = await imagga.uploadImage({
    data: formData,
    headers: formData.getHeaders(),
  });
  return result.upload_id;
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const updateType = {
  type: "string",
  label: "Use File URL or File Path",
  description: "Whether to upload a file from a URL or from the `/tmp` folder",
  options: [
    "File URL",
    "File Path",
  ],
  reloadProps: true,
};

export async function additionalProps(previousProps) {
  const { updateType } = this;

  if (updateType === "File URL") {
    previousProps.fileUrl.hidden = false;
    previousProps.filePath.hidden = true;
  } else if (updateType === "File Path") {
    previousProps.fileUrl.hidden = true;
    previousProps.filePath.hidden = false;
  } else {
    previousProps.fileUrl.hidden = true;
    previousProps.filePath.hidden = true;
  }

  return {};
}

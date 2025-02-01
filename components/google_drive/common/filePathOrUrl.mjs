export const useFileUrlOrPath = {
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
  const { useFileUrlOrPath } = this;

  if (useFileUrlOrPath === "File URL") {
    previousProps.fileUrl.hidden = false;
    previousProps.filePath.hidden = true;
  } else if (useFileUrlOrPath === "File Path") {
    previousProps.fileUrl.hidden = true;
    previousProps.filePath.hidden = false;
  }

  return {};
}

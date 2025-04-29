const normalizeFilepath = (filename, ext = "pdf") => {
  let filepath = filename.includes("/tmp")
    ? filename
    : `/tmp/${filename}`;
  filepath = filepath.includes(`.${ext}`)
    ? filepath
    : `${filepath}.${ext}`;
  return filepath;
};

export {
  normalizeFilepath,
};

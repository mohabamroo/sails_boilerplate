import sanitize from 'sanitize-filename';
const UPLOADS_DIR = 'file_uploads';
const GENERAL_UPLOAD_DIR = 'file_uploads/general';

const generateFilename = function(__newFileStream, next) {
  try {
    let nameArr = __newFileStream.filename.split('.');
    let mimetype = nameArr.pop();
    let fileName = nameArr[0];
    fileName = fileName.substring(0, 10);
    fileName += new Date().getTime();
    let newFileName = `${sanitize(fileName).toLowerCase()}.${mimetype}`;
    newFileName = newFileName.replace(' ', '_');
    return next(undefined, newFileName);
  } catch (err) {
    return next(err);
  }
};

const resloveUploadDir = relativePath => {
  return require('path').resolve(
    sails.config.appPath,
    UPLOADS_DIR,
    relativePath
  );
};

module.exports = {
  generateFilename,
  GENERAL_UPLOAD_DIR,
  resloveUploadDir
};

import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';

export const getStringNameFromURL = (url, ending) => {
  const { hostname, pathname } = new URL(url);
  const urlString = `${hostname}${pathname}`;
  const regex = /\W/gm;
  const outputName = urlString.replace(regex, '-').concat(ending);
  return outputName;
};

const pageloader = (url, pathToDir) => {
  const outputFileName = getStringNameFromURL(url, '.html');
  const ouputDirName = getStringNameFromURL(url, '_files');

  return axios.get(url)
    .then((response) => response.data)
    .then((data) => fs.appendFile(path.resolve(pathToDir, outputFileName), data))
    .then(() => fs.mkdir(path.resolve(pathToDir, ouputDirName)))
    .catch((err) => console.error(err));
};

export default pageloader;

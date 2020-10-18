import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';

const pageloader = (url, pathToDir) => {
  const { hostname, pathname } = new URL(url);
  const urlString = `${hostname}${pathname}`;
  const regex = /\W/gm;
  const outputFileName = urlString.replace(regex, '-').concat('.html');

  axios.get(url)
    .then((response) => response.data)
    .then((data) => fs.appendFile(path.resolve(pathToDir, outputFileName), data))
    .catch((err) => console.error(err));
};

export default pageloader;

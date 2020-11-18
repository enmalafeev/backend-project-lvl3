import axios from 'axios';
import path from 'path';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';

export const getStringNameFromURL = (url, ending) => {
  const { hostname, pathname } = new URL(url);
  const urlString = `${hostname}/${pathname}`;
  const regex = /\W/gm;
  const outputName = urlString.replace(regex, '-').concat(ending);
  return outputName;
};

const parse = (data) => {
  const $ = cheerio.load(data);
  const links = $('html').find('img').map(function () {
    return $(this).attr('src');
  }).get();
  return links;
};

const downloadImages = (links, url) => {
  const promises = links.map((link) => axios({
    method: 'get',
    url: `${url}/${link}`,
    responseType: 'arraybuffer',
  }));
  return Promise.all(promises)
    .catch((err) => console.error(err));
};

const pageloader = (url, pathToDir) => {
  const outputFileName = getStringNameFromURL(url, '.html');
  const ouputDirName = getStringNameFromURL(url, '_files');
  let html;

  return axios.get(url)
    .then((response) => {
      html = response.data;
      return html;
    })
    .then((data) => fs.appendFile(path.resolve(pathToDir, outputFileName), data))
    .then(() => fs.mkdir(path.resolve(pathToDir, ouputDirName)))
    .then(() => parse(html))
    .then((links) => downloadImages(links, url))
    // .then((imgs) => console.log(imgs))
    .then((images) => images.map((img) => fs.appendFile(path.resolve(pathToDir, ouputDirName, getStringNameFromURL(img.config.url, path.extname(img.config.url))), img.data)))
    .catch((err) => console.error(err));
};

export default pageloader;

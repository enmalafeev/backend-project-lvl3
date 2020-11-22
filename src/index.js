import axios from 'axios';
import path from 'path';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';
import prettier from 'prettier';

export const getStringNameFromURL = (url, ending) => {
  const { hostname, pathname } = new URL(url);
  const { dir, name } = path.parse(pathname);
  const urlString = `${hostname}${dir}/${name}`;
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

const updateHTML = (html, data) => {
  const $ = cheerio.load(html);
  $('html').find('img').map(function (index) {
    return $(this).attr('src', data[index]);
  });
  return $.html();
};

const downloadImages = (links, url) => {
  const promises = links.map((link) => axios({
    method: 'get',
    url: `${url}${link}`,
    responseType: 'arraybuffer',
  }));
  return Promise.all(promises)
    .catch((err) => console.error(err));
};

const pageloader = (url, pathToDir) => {
  const outputFileName = getStringNameFromURL(url, '.html');
  const ouputDirName = getStringNameFromURL(url, '_files');
  let html;
  let links;
  let images;

  return axios.get(url)
    .then((response) => {
      html = response.data;
      links = parse(html);
      return html;
    })
    .then((data) => fs.appendFile(path.resolve(pathToDir, outputFileName), data))
    .then(() => fs.mkdir(path.resolve(pathToDir, ouputDirName)))
    .then(() => downloadImages(links, url))
    .then((imgPaths) => Promise.all(imgPaths.map((img) => fs.appendFile(path.resolve(pathToDir, ouputDirName, getStringNameFromURL(img.config.url, path.extname(img.config.url))), img.data))))
    .then(() => fs.readdir(path.resolve(pathToDir, ouputDirName)))
    .then((imgData) => {
      images = imgData.map((pathImg) => `${ouputDirName}/${pathImg}`);
    })
    .then(() => {
      const updatedHTML = updateHTML(html, images);
      html = prettier.format(updatedHTML, { parser: 'html' });
      return fs.writeFile(path.resolve(pathToDir, outputFileName), html);
    })
    .catch((err) => console.error(err));
};

export default pageloader;

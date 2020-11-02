import os from 'os';
import path from 'path';
import axios from 'axios';
import nock from 'nock';
import httpAdapter from 'axios/lib/adapters/http';
import { promises as fs } from 'fs';
import {
  test, beforeEach, beforeAll, expect,
} from '@jest/globals';
import pageloader, { getStringNameFromURL } from '../src';

axios.defaults.adapter = httpAdapter;
nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';
const expected = '<!DOCTYPE html><html><head></head><body></body></html>';
let tempDir;
// let before;
// let after;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

// beforeAll(async () => {
//   before = await fs.readFile(path.resolve('./__fixtures__', 'before.html'), 'utf-8');
//   after = await fs.readFile(path.resolve('./__fixtures__', 'after.html'), 'utf-8');
// });

test('fetchData', async () => {
  const fileName = getStringNameFromURL(url, '.html');

  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, expected);
  await pageloader(url, tempDir);
  const resultFile = await fs.readFile(path.resolve(tempDir, fileName), 'utf-8');

  expect(resultFile).toEqual(expected);
});

// test('fetchImages', async () => {
//   nock('https://ru.hexlet.io').get('/courses').reply(200, before);
//   await pageloader(url, tempDir);
//   const files = await fs.readdir(tempDir);
// });

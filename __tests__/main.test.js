import os from 'os';
import path from 'path';
import nock from 'nock';
import { promises as fs } from 'fs';
import {
  test, beforeEach,
} from '@jest/globals';
import pageloader from '../src';

nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';
const expected = '<!DOCTYPE html><html><head></head><body></body></html>';
let tempDir;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('fetchData', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, expected);
  await pageloader(url, tempDir);
  console.log('tempDir: ', tempDir);
  const files = await fs.readdir(tempDir);
  console.log('files: ', files);
  // const resultFile = await fs.readFile(files[0]);
  // expect(resultFile).toEqual(expected);
});

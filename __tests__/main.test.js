import os from 'os';
import path from 'path';
import axios from 'axios';
import nock from 'nock';
import httpAdapter from 'axios/lib/adapters/http';
import { promises as fs } from 'fs';
import {
  test, beforeEach, beforeAll, expect,
} from '@jest/globals';
import pageloader from '../src';

axios.defaults.adapter = httpAdapter;
nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';
let expected;
let tempDir;
let before;
let after;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

beforeAll(async () => {
  expected = await fs.readFile(path.resolve('./__fixtures__', 'expected.html'), 'utf-8');
  before = await fs.readFile(path.resolve('./__fixtures__', 'before.html'), 'utf-8');
  after = await fs.readFile(path.resolve('./__fixtures__', 'after.html'), 'utf-8');
});

test('fetchData', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, expected);
  await pageloader(url, tempDir);
  const files = await fs.readdir(tempDir);
  const resultFile = await fs.readFile(path.resolve(tempDir, files[0]), 'utf-8');

  expect(resultFile).toEqual(expected);
});

test('fetchImages', async () => {
  nock('https://ru.hexlet.io')
    .persist()
    .get('/courses')
    .reply(200, before)
    .get(/assets\/.*/i)
    .reply(200, { data: [1, 2] });

  await pageloader(url, tempDir);
  const files = await fs.readdir(tempDir);
  const resultFile = await fs.readFile(path.resolve(tempDir, files[0]), 'utf-8');
  const resultDir = await fs.readdir(path.resolve(tempDir, files[1]), 'utf-8');

  expect(resultFile).toEqual(after);
  expect(resultDir).toHaveLength(2);
});

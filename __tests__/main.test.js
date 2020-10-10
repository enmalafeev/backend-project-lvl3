import path from 'path';
import nock from 'nock';
import { promises as fs } from 'fs';
import { test, expect, beforeAll } from '@jest/globals';
import pageloader from '../src';

nock.disableNetConnect();

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');
const url = 'https://hexlet.io/courses';
const html = '<ul><li>one</li><li>two</li><li>three</li></ul>';
let expected;

beforeAll(async () => {
  expected = await readFile('page.html');
});

test('fetchData', async () => {
  nock(url)
    .get('/')
    .reply(200, html);
  const result = await pageloader(url);
  expect(result).toEqual(expected);
});

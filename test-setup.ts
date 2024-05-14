import { HTTPDriver } from './driver/HTTPDriver';
import { TestDriver } from './dsl/TestDriver';

export const getTestDriver = (): TestDriver => {
  return new HTTPDriver('https://httpbin.org/post');
};

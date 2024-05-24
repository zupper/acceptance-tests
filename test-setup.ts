import { TestDriver } from './dsl/TestDriver';
import { HTTPDriver } from './driver/http/HTTPDriver';

const platform = process.env.PLATFORM ?? 'http';

export const getTestDriver = (): TestDriver => {
  switch (platform) {
    case 'http': return new HTTPDriver('https://httpbin.org/post');
    default: throw new Error('Invalid platform requested');
  }
};

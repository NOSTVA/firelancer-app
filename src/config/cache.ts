import { createCache } from "async-cache-dedupe";

function setupCache(res: any, opts: any) {
  if (opts === true) {
    opts = { ttl: 0 };
  } else {
    opts.ttl = 0;
  }
  const cache = createCache(opts);
  return cache;
}

export { setupCache };

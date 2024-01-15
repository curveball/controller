import * as path from 'node:path';
import * as url from 'node:url';

/** @ts-expect-error CommonJS/ESM fun */
const dirname =
  typeof __dirname !== 'undefined' ?
    __dirname :
    path.dirname(url.fileURLToPath(eval('import.meta.url')));

console.log(dirname);

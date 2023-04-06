/// <reference lib="webworker" />

import { AI } from './ai';

const idiot = new AI();

addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'ini':
      idiot.init(data.color, data.mode);
      break;

    case 'watch':
      idiot.watch(data.row, data.col, data.color);
      break;

    case 'regret':
      idiot.regret(data.row, data.col);
      break;

    case 'compute': {
      // decision
      const start = Date.now() / 1000;
      const ret = idiot.play();
      const end = Date.now() / 1000;
      console.log("AI Spent: " + (end - start) + " seconds.");
      console.log(ret)

      postMessage({
        type: 'decision',
        row: ret[1][0],
        col: ret[1][1]
      });

      break;
    }

    default:
      console.error(data.type + ' not supported');
      break;
  }
});

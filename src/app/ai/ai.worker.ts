/// <reference lib="webworker" />

import { AI } from './ai';

const idiot = new AI();

function decision() {
  const start = Date.now() / 1000;
  const ret = idiot.play();
  const end = Date.now() / 1000;
  console.log("AI Spent: " + (end - start) + " seconds.");

  postMessage({
    type: 'decision',
    row: ret[1][0],
    col: ret[1][1]
  });
}

addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'ini':
      idiot.init(data.color, data.mode);
      break;

    case 'watch':
      idiot.watch(data.row, data.col, data.color);
      break;

    case 'compute':
      decision();
      break;

    default:
      console.error(data.type + ' not supported');
      break;
  }
});

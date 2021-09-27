/// <reference lib="webworker" />

const boardBuf = new ArrayBuffer(255);
const boardBufArr = new Uint8Array(boardBuf);

function bufToString(){
  return String.fromCharCode.apply(null, boardBufArr);
}

class MapPoint {
  r = 0;
  c = 0;
  score = 0;
  set = false;
  valid = false;
  info = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ];

  constructor(r, c) {
    this.r = r;
    this.c = c;
  }
}

class AI {

  color;
  otc;

  depth;
  totry;

  cache = {};

  sum = 0;
  setNum = 0;
  scoreMap = [];
  scorequeue = [];

  map = [];

  moves = [
    [-1, -1],
    [-1, 0],
    [0, -1],
    [-1, 1]
  ];
  coe = [-2, 1];
  scores = [0, 1, 10, 2000, 4000, 100000000000];

  constructor() {
    for (let i = 0; i < 15; i++) {
      const tmp=[];
      for(let j = 0; j < 15; j++) {
        const a = new MapPoint(i, j);
        tmp.push(a);

        this.scorequeue.push(a);
      }

      this.map.push(tmp);
    }
  }

  init(mode, color) {
    this.color = color;
    this.otc = color === 'black' ? 'white' : 'black';

    switch (mode) {
      case 'easy':
        this.depth = 3;
        this.totry = [30, 30];
        break;

      case 'medium':
        this.depth = 5;
        this.totry = [12, 8];
        break;

      case 'master':
        this.depth = 7;
        this.totry = [10, 10];
        break;

      default:
        console.error(mode + ' not supported');
        break;
    }
  }

  watch(r, c, color) {
    this.update(r, c, color);

    if (color === 'remove') {
      this.setNum--;
    } else {
      this.setNum++;
    }

    this.scorequeue.sort(this.sortMove);
    postMessage({'type': 'watch_complete'});
  }

  move() {
    postMessage({type: 'starting'});

    this.cache = {};

    let alpha = -1 / 0;
    let beta = 1 / 0;
    let bestmove = [this.scorequeue[0].r, this.scorequeue[0].c];
    let i = 20;
    let tmp, tmpqueue = [];
    let depth = this.depth;

    while (i--) {
      tmp = this.scorequeue[i];
      if (tmp.score.set) continue;
      tmpqueue.push(tmp.c);
      tmpqueue.push(tmp.r);
    }

    i = tmpqueue.length - 1;

    let x, y, b = beta;
    x = tmpqueue[i];
    y = tmpqueue[--i];
    let score = -this.nega(x, y, depth, -b, -alpha);

    this.desimulate(x, y, depth % 2);

    if (score > alpha) {
      alpha = score;
      bestmove = [x, y];
    }

    b = alpha + 1;

    while (i--) {
      x = tmpqueue[i];
      y = tmpqueue[--i];
      score = -this.nega(x, y, depth, -b, -alpha);
      this.desimulate(x, y, depth % 2);
      if (alpha < score && score < beta) {
        score = -this.nega(x, y, depth, -beta, -alpha);
        this.desimulate(x, y, depth % 2);
      }
      if (score > alpha) {
        alpha = score;
        bestmove = [x, y];
      }
      b = alpha + 1;
    }

    postMessage({
      type: 'decision',
      r: bestmove[0],
      c: bestmove[1]
    });
  }

  sortMove(a, b) {
    if (a.set) return 1;
    if (b.set) return -1;
    if (a.score < b.score) return 1;
    return -1;
  }

  simulate(x, y, num) {
    this._update(x, y, num);
    this.setNum++;
  }

  desimulate(x, y, num) {
    this._remove(x, y, num);
    this.setNum--;
  }

  nega(x, y, depth, alpha, beta) {
    let pt = this.map[x][y].info;
    let i = 4;
    let num = depth % 2;

    this.simulate(x, y, num);

    let bufstr = bufToString();

    if (this.cache[bufstr]) {
      return this.cache[bufstr];
    }

    if (Math.abs(this.sum) >= 10000000) return -1 / 0;

    if (this.setNum === 225) {
      return 0;
    }

    if (depth === 0) {
      return this.sum;
    }

    this.scorequeue.sort(this.sortMove);

    i = this.totry[num]
    let tmp, tmpqueue = [];
    let b = beta;

    while (i--) {
      tmp = this.scorequeue[i];
      if (tmp.set) continue;
      tmpqueue.push(tmp.c);
      tmpqueue.push(tmp.r);
    }

    depth -= 1;
    i = tmpqueue.length - 1;
    x = tmpqueue[i];
    y = tmpqueue[--i];
    let score = -this.nega(x, y, depth, -b, -alpha);
    this.desimulate(x, y, depth % 2);

    if (score > alpha) {
      bufstr = bufToString();
      this.cache[bufstr] = score;
      alpha = score;
    }

    if (alpha >= beta) {
      bufstr = bufToString();
      this.cache[bufstr] = beta;
      return alpha;
    }

    b = alpha + 1;

    while (i--) {
      x = tmpqueue[i];
      y = tmpqueue[--i];
      score = -this.nega(x, y, depth, -b, -alpha);
      this.desimulate(x, y, depth % 2);
      if (alpha < score && score < beta) {
        score = -this.nega(x, y, depth, -beta, -alpha);
        this.desimulate(x, y, depth % 2);
      }
      if (score > alpha) {
        alpha = score;
      }
      if (alpha >= beta) {
        return alpha;
      }
      b = alpha + 1;
    }
    return alpha;
  }

  update(r, c, color) {
    let num;
    let remove = false;

    if (color === this.color) {
      num=1;

    } else if (color === this.otc) {
      num=0;

    } else {
      remove = true;
      num = this.map[r][c].set - 1;
    }

    if (remove) {
      this._update(r, c, num);

    } else {
      this._remove(r, c, num);
    }
  }

  _update(r, c, num) {
    let coe = this.coe;
    let moves = this.moves;
    let scores = this.scores;

    let i = 4;
    let x;
    let y;
    let step;
    let tmp;
    let xx;
    let yy;
    let cur;
    let s;
    let e;
    let changes = 0;

    boardBufArr[r * 15 + c] = num + 2;
    this.map[r][c].set = num + 1;

    while (i--) {
      x = r;
      y = c;
      step = 5;

      while (step-- && x >= 0 && y >= 0 && y < 15) {
        xx = x - moves[i][0] * 4;
        yy = y - moves[i][1] * 4;

        if (xx >= 15 || yy < 0 || yy >= 15) {
          x += moves[i][0];
          y += moves[i][1];
          continue;
        }

        cur = this.map[x][y].info[i];

        if (cur[2] > 0) {
          tmp = 5;
          xx = x;
          yy = y;
          s = scores[cur[2]];
          changes -= s * cur[3];

          while (tmp--){
            this.map[xx][yy].score -= s;
            xx -= moves[i][0];
            yy -= moves[i][1];
          }
        }

        cur[num]++;

        if (cur[1-num] > 0) {
          cur[2] = 0;

        } else {
          cur[2] = cur[num];
          e = coe[num];
          cur[3] = e;
          s = scores[cur[2]];

          tmp = 5;
          xx = x;
          yy = y;
          changes += s * cur[3];

          while (tmp--){
            this.map[xx][yy].score += s;
            xx -= moves[i][0];
            yy -= moves[i][1];
          }
        }

        x += moves[i][0];
        y += moves[i][1];
      }
    }

    this.sum += changes;
  }

  _remove(r, c, num) {
    boardBufArr[r * 15 + c] = 0;
    this.map[r][c].set = false;

    let coe = this.coe;
    let moves = this.moves;
    let scores = this.scores;

    let i = 4;
    let x;
    let y;
    let step;
    let tmp;
    let xx;
    let yy;
    let cur;
    let s;
    let changes = 0;

    while (i--) {
      x = r;
      y = c;
      step = 5;
      //others 0 i am 1-> sc=0
      //others 0 i am more than 1-> sc=1
      //i am >0 others >0 -> sc=-1

      while( step-- && x>=0 && y>=0 && y<15 ){
        xx = x - moves[i][0] * 4;
        yy = y - moves[i][1] * 4;

        if (xx >= 15 || yy < 0 || yy >= 15) {
          x += moves[i][0];
          y += moves[i][1];
          continue;
        }
        cur = this.map[x][y].info[i];
        let sc=0;
        cur[num]--;

        if (cur[2] > 0) {
          tmp = 5;
          xx = x;
          yy = y;
          s = scores[cur[2]];
          changes -= s * cur[3];

          while (tmp--) {
            this.map[xx][yy].score -= s;
            xx -= moves[i][0];
            yy -= moves[i][1];
          }

          cur[2]--;

          if(cur[num]>0) {
            sc=1;
          }

        } else if(cur[1-num] > 0 && !cur[num]) {
          sc = -1;
        }

        if (sc === 1) {
          tmp = 5;
          s = scores[cur[2]];
          xx = x;
          yy = y;
          changes += s * cur[3];

          while (tmp--) {
            this.map[xx][yy].score += s;
            xx -= moves[i][0];
            yy -= moves[i][1];
          }

        } else if (sc === -1) {
          cur[2] = cur[1 - num];
          tmp = 5;
          s = scores[cur[2]];
          cur[3] = coe[1 - num];
          xx = x;
          yy = y;
          changes += s * cur[3];

          while (tmp--) {
            this.map[xx][yy].score += s;
            xx -= moves[i][0];
            yy -= moves[i][1];
          }
        }

        x += moves[i][0];
        y += moves[i][1];
      }
    }

    this.sum += changes;
  }

}

const ai = new AI();

addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'ini':
      ai.init(data.mode, data.color);
      break;

    case 'watch':
      ai.watch(data.r, data.c, data.color);
      break;

    case 'compute':
      ai.move();
      break;

    default:
      console.error(data.type + ' not supported');
      break;
  }
});


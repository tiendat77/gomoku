import * as lodash from 'lodash';

/**
 * Base-on: HTML5-Gomoku
 * https://github.com/yyjhao/HTML5-Gomoku
 */

export class AI {

  rules: any[] = [];
  maxList = [0x7fffffff + 1];

  player: number;
  hardness: number;

  grid: number[][] = [];

  constructor() {
    for (var i = 1; i < 8; i++) {
      this.maxList.push(this.maxList[i - 1] / 8);
    }

    for (let i = 0; i < 15; i++) {
      this.grid[i] = new Array(15);
      for (let j = 0; j < 15; j++) {
        this.grid[i][j] = -1;
      }
    }

    this.rules[0] = this._genRules(0);
    this.rules[1] = this._genRules(1);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  init(player: number, hardness: number) {
    this.player = player;
    this.hardness = hardness;
  }

  watch(row: number, col: number, player: number) {
    this.grid[row][col] = player;
  }

  regret(row: number, col: number) {
    this.grid[row][col] = -1;
  }

  play(
    grid = this.grid,
    crtPlayer = this.player,
    depth = this.hardness,
    maxChance?: number
  ): any {
    if (depth == 0) {
      return [this._chance(grid, crtPlayer), null];
    }

    let row = grid.length;
    let col = grid[0].length;

    const notAlone = function(grid: number[][], r: number, c: number) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let newi = i + r;
          let newj = j + c;

          if (newi < 0 || newj < 0 || newi >= grid.length || newj >= grid[0].length) {
            continue;
          }
          if ((i != 0 || j != 0) && (grid[i + r][j + c] == 0 || grid[i + r][j + c] == 1)) {
            return true;
          }
        }
      }

      return false;
    }

    let ret: any[] = [-0x7fffffff * 100, null];

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (grid[i][j] != -1) continue;

        if (!notAlone(grid, i, j)) continue;

        grid[i][j] = crtPlayer;

        if (depth != 1) {
          if (this._isOver(grid, [i, j])) {
            grid[i][j] = -1;
            return [0x7fffffff * 10, [i, j]];
          }
        }

        const enm_ret = this.play(grid, this._switchPlayer(crtPlayer), depth - 1, -ret[0]);
        grid[i][j] = -1;

        const enm_cs = -enm_ret[0];

        if (maxChance && enm_cs > maxChance) {
          return [enm_cs, [i, j]];
        }

        if (enm_cs > ret[0]) {
          ret = [enm_cs, [i, j]];
        } else if (enm_cs == ret[0] && Math.random() < 0.5) {
          ret = [enm_cs, [i, j]];
        }
      }
    }

    return ret;
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  private _switchPlayer(crt: number): number {
    return 1 - crt;
  }

  private _genRules(crt: number) {
    const otr = this._switchPlayer(crt);
    return [
      [[crt, 5, 0], this.maxList[0]],
      [[crt, 5, 1], this.maxList[0]],
      [[crt, 5, 2], this.maxList[0]],
      [[otr, 5, 0], -this.maxList[1]],
      [[otr, 5, 1], -this.maxList[1]],
      [[otr, 5, 2], -this.maxList[1]],
      [[crt, 4, 1], this.maxList[2]],
      [[crt, 4, 2], this.maxList[2]],
      [[otr, 4, 2], -this.maxList[3]],
      [[crt, 3, 2], this.maxList[4]],
      [[otr, 3, 2], -this.maxList[5]],
      [[otr, 4, 1], -this.maxList[5]],
      [[crt, 2, 2], this.maxList[6]],
      [[crt, 3, 1], this.maxList[6]],
      [[otr, 2, 2], -this.maxList[6]],
      [[otr, 3, 1], -this.maxList[6]],
      [[crt, 2, 1], this.maxList[7]],
      [[otr, 2, 1], -this.maxList[7]],
    ];
  };

  private _orgs(grid: number[][]) {
    const row = grid.length;
    const col = grid[0].length;
    return [
      [lodash.map(lodash.range(0, col), function(v) {return [0, v];}),
      [[1, 0], [1, 1], [1, -1]]],
      [lodash.map(lodash.range(0, col), function(v) {return [row - 1, v];}),
      [[-1, 1], [-1, -1]]],
      [lodash.map(lodash.range(0, row), function(v) {return [v, 0];}),
      [[0, 1]]]
    ];
  }

  private _getRow(grid: number[][], org: number[], dir: number[]) {
    let row = grid.length;
    let col = grid[0].length;
    let i = org[0];
    let j = org[1];
    let ret: any[] = [[]];
    let cnt = 0;

    while (i < row && j < col && i >= 0 && j >= 0) {
      if (lodash.isEmpty(ret[cnt]) || lodash.last(ret[cnt]) == grid[i][j])
        ret[cnt].push(grid[i][j]);
      else {
        cnt += 1;
        ret[cnt] = [];
        ret[cnt].push(grid[i][j]);
      }

      i += dir[0];
      j += dir[1];
    }

    return ret;
  }

  private _calcState(grid: number[][]) {
    const ret: any = {};

    const createOrIncrease = function(ctr: number, l: number, h: number) {
      if (!ret[ctr]) {
        ret[ctr] = {};
      }

      if (!ret[ctr][l]) {
        ret[ctr][l] = {};
      }

      if (!ret[ctr][l][h]) {
        ret[ctr][l][h] = 1;
      } else {
        ret[ctr][l][h]++;
      }
    }

    const that = this;

    lodash.each(this._orgs(grid), function(org) {
      for (let i = 0; i < org[0].length; i++) { // orgs
        for (let j = 0; j < org[1].length; j++) {  // dirs
          let rows = that._getRow(grid, org[0][i], org[1][j]);
          for (let k = 0; k < rows.length; k++) {
            if (rows[k][0] == -1 || rows[k].length < 2) continue;
            let head = 0;
            if (k != 0 && rows[k - 1][0] == -1) head += 1;
            if (k != rows.length - 1 && rows[k + 1][0] == -1) head += 1;
            createOrIncrease(rows[k][0], rows[k].length, head);
          }
        }
      }
    });

    return ret;
  }

  private _chance(grid: number[][], crt: number) {
    let state = this._calcState(grid);
    let getInState = function(r: number[]) {
      let tmp = state[r[0]];
      if (!tmp) return 0;
      tmp = tmp[r[1]];
      if (!tmp) return 0;
      tmp = tmp[r[2]];
      if (!tmp) return 0;
      return tmp;
    };

    let ret = 0;

    lodash.each(this.rules[crt], function(rule) {
      ret += getInState(rule[0]) * rule[1];
    });

    return ret;
  }

  private _isOver(grid: number[][], cell: number[]) {
    let dirs = [
      [0, 1], [1, 0],
      [1, 1], [-1, 1]
    ];
    let crt = grid[cell[0]][cell[1]];
    let row = grid.length;
    let col = grid[0].length;

    const rets = lodash.map(dirs, function(dir) {
      let cnt = 1;
      for (let i = -1; i <= 1; i += 2) {
        let sy = cell[0] + i * dir[0];
        let sx = cell[1] + i * dir[1];

        while (sy < row && sy >= 0 && sx < col && sx >=0 && grid[sy][sx] == crt) {
          cnt++;
          sy += i * dir[0];
          sx += i * dir[1];
        }
      }
      return cnt;
    });

    if (lodash.max(rets) >= 5) {
      return true;
    } else {
      return false;
    }
  }

}

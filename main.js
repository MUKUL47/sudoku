(() => {
  class Dom {
    selectedIndex = null;
    selectedNumber = null;
    #board = document.querySelector(".board");
    #keypad = document.querySelector('div[target="keypad"]');
    #addNumberCallback;
    #clearBtn = document.querySelector('button[target="clear"]');
    //
    constructor() {
      this.#initialize();
      this.#board.addEventListener("click", this.#onClick);
      this.#keypad.addEventListener("click", this.onKeypadClick);
      this.#clearBtn.addEventListener("click", this.onClearClick);
    }
    setStorage(type = "DATA", data) {
      localStorage.setItem(type, JSON.stringify(data));
    }
    getStorage(type = "DATA") {
      try {
        const d = localStorage.getItem(type);
        if (!d) return null;
        return JSON.parse(d);
      } catch (e) {
        return null;
      }
    }
    initializeCallbacks(addNumberCallback) {
      this.#addNumberCallback = addNumberCallback;
    }
    qS(q, all = false) {
      return (all && document.querySelectorAll(q)) || document.querySelector(q);
    }

    won() {
      localStorage.clear();
      this.#board.removeEventListener("click", this.#onClick);
      this.#keypad.removeEventListener("click", this.onKeypadClick);
      this.#clearBtn.removeEventListener("click", this.onClearClick);
      this.#board.classList.add("won");
      setTimeout(() => alert("You Won !!!"), 1000);
    }

    getSegment = (i, j) => {
      //top
      if (j < 3) {
        if (i < 3) return 0;
        if (i > 2 && i < 6) return 1;
        return 2;
      }
      //mid
      if (j > 2 && j < 6) {
        if (i < 3) return 3;
        if (i > 2 && i < 6) return 4;
        return 5;
      }
      //bottom
      if (j > 5) {
        if (i < 3) return 6;
        if (i > 2 && i < 6) return 7;
        return 8;
      }
    };

    getSegmentCoordinates(index) {
      switch (index) {
        case 0:
          return { iStart: 0, iEnd: 2, jStart: 0, jEnd: 2 };
        case 1:
          return { iStart: 0, iEnd: 2, jStart: 3, jEnd: 5 };
        case 2:
          return { iStart: 0, iEnd: 2, jStart: 6, jEnd: 8 };
        //
        case 3:
          return { iStart: 3, iEnd: 5, jStart: 0, jEnd: 2 };
        case 4:
          return { iStart: 3, iEnd: 5, jStart: 3, jEnd: 5 };
        case 5:
          return { iStart: 3, iEnd: 5, jStart: 6, jEnd: 8 };
        //
        case 6:
          return { iStart: 6, iEnd: 8, jStart: 0, jEnd: 2 };
        case 7:
          return { iStart: 6, iEnd: 8, jStart: 3, jEnd: 5 };
        case 8:
          return { iStart: 6, iEnd: 8, jStart: 6, jEnd: 8 };
      }
    }
    setBlockValidity(i, j, valid) {
      const e = this.qS(`block[i="${i}"][j="${j}"]`);
      if (!valid) {
        return e?.setAttribute("invalid-block", true);
      }
      e?.removeAttribute("invalid-block");
    }
    addNumber() {
      if (!this.selectedIndex) return;
      const { i, j } = this.selectedIndex;
      const e = this.qS(`block[i="${i}"][j="${j}"]`);
      e.innerText = this.selectedNumber == -1 ? "" : this.selectedNumber;
    }

    onClearClick = () => {
      if (!this.selectedIndex) return;
      this.selectedNumber = -1;
      this.#addNumberCallback?.(this.selectedNumber, this.selectedIndex);
    };
    onKeypadClick = ({ srcElement }) => {
      const n = srcElement.getAttribute("value");
      if (!n) return;
      this.selectedNumber = n;
      this.#addNumberCallback?.(this.selectedNumber, this.selectedIndex);
    };

    #onClick = ({ srcElement }) => {
      if (!srcElement) return;
      if (srcElement.hasAttribute("inactive")) return;
      const i = srcElement.getAttribute("i");
      const j = srcElement.getAttribute("j");
      this.clearBlocks("block", "selected");
      srcElement.setAttribute("selected", true);
      this.setBlockIndex(i, j);
    };

    setBlockIndex = (i, j, getElement) => {
      if (getElement) {
        this.qS(`block[i="${i}"][j="${j}"]`)?.setAttribute("selected", true);
      }
      const { iStart, iEnd, jStart, jEnd } = this.getSegmentCoordinates(
        this.getSegment(i, j)
      );
      this.clearBlocks("block", "in-vicinity");
      const coords = [];
      for (let k = 0; k < 9; k++) {
        coords.push({ i: j, j: k });
        coords.push({ i: k, j: i });
      }
      for (let i = iStart; i <= iEnd; i++) {
        for (let j = jStart; j <= jEnd; j++) {
          coords.push({ i, j });
        }
      }
      coords.forEach(({ i, j }) => {
        const e = this.qS(`block[i="${j}"][j="${i}"]`);
        e.setAttribute("in-vicinity", true);
      });
      this.selectedIndex = { i, j };
      this.setStorage("SELECTED_INDEX", { i, j });
    };

    clearBlocks(element = "block", q) {
      [...this.qS(`${element}[${q}="true"]`, true)].forEach((v) =>
        v.removeAttribute(q)
      );
    }
    async #initialize() {
      this.#board.innerHTML = "";
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const block = document.createElement("block");
          block.setAttribute("i", i);
          block.setAttribute("j", j);
          this.#board.appendChild(block);
        }
      }
    }

    initializeData(data) {
      for (let j = 0; j < 9; j++) {
        for (let i = 0; i < 9; i++) {
          const { value, inactive } = data[i][j];
          if (value === -1) continue;
          const e = this.qS(`block[i="${j}"][j="${i}"]`);
          e.innerText = value;
          inactive && e.setAttribute("inactive", true);
        }
      }
    }
  }
  class Sudoku extends Dom {
    #data = [
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
      [
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
        { value: -1 },
      ],
    ];
    constructor() {
      super();
      this.initializeCallbacks(this.#onNumberAdd);
      const local = this.getStorage();
      if (local) {
        this.#data = local;
        this.initializeData(this.#data);
        this.#reinitializeValidityToDom();
        const indexes = this.getStorage("SELECTED_INDEX");
        indexes && this.setBlockIndex(indexes.i, indexes.j, true);
      } else {
        this.#initializeNumbers();
      }
    }

    //only for localstorage
    #reinitializeValidityToDom() {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const { value, validMove } = this.#data[i][j];
          if (value > -1) {
            this.#sendBlockValidityToDom(i, j, validMove);
          }
        }
      }
    }

    #onNumberAdd(number, index) {
      if (!index || number == this.#data[index.j][index.i].value) return;
      this.#data[index.j][index.i] = {
        value: Number(number),
      };
      for (let i = 0; i < 9; i++) {
        START: for (let j = 0; j < 9; j++) {
          const val = this.#data[i][j].value;
          this.#sendBlockValidityToDom(i, j, true);
          if (val > 0) {
            for (let h = 0; h < 9; h++) {
              const vVal = this.#data[h][j].value;
              const hVal = this.#data[i][h].value;
              if (vVal > -1 && h != i && vVal == val) {
                this.#sendBlockValidityToDom(i, j, false);
                continue START;
              }
              if (hVal > -1 && h != j && hVal == val) {
                this.#sendBlockValidityToDom(i, j, false);
                continue START;
              }
            }

            const { iStart, jStart, iEnd, jEnd } = this.getSegmentCoordinates(
              this.getSegment(j, i)
            );
            for (let k = iStart; k <= iEnd; k++) {
              for (let l = jStart; l <= jEnd; l++) {
                const { value } = this.#data[k][l];
                if (value > -1 && (k != i || j != l) && value == val) {
                  this.#sendBlockValidityToDom(i, j, false);
                  continue START;
                }
              }
            }
          }
        }
      }
      this.setStorage("DATA", this.#data);
      this.addNumber();
      this.#data.flat().filter(({ value, validMove }) => value > 0 && validMove)
        .length === 81 && this.won();
    }
    #sendBlockValidityToDom(i, j, flag) {
      this.#data[i][j].validMove = flag;
      this.setBlockValidity(j, i, flag);
    }

    #getRand(exclude = [], max = 9, min = 1, returnNull) {
      const _ = () => Math.floor(Math.random() * (max - min + min) + min);
      let r = _();
      const set = new Set();
      while (exclude.includes(r)) {
        r = _();
        if (set.size === max && returnNull) {
          return null;
        }
        set.add(r);
      }
      return r;
    }

    #getAllNumbersInVicinity(i, j, segmentIndex) {
      const currentNumbers = new Set();
      for (let k = 0; k < 9; k++) {
        currentNumbers.add(this.#data[i][k]?.value);
        currentNumbers.add(this.#data[k][j]?.value);
      }
      let { iStart, iEnd, jStart, jEnd } =
        this.getSegmentCoordinates(segmentIndex);
      for (let i = iStart; i <= iEnd; i++) {
        for (let j = jStart; j <= jEnd; j++) {
          if (this.#data[j][i].value > 0) {
            currentNumbers.add(this.#data[j][i].value);
          }
        }
      }
      return Array.from(currentNumbers);
    }

    #resetSegementNumbers(segment) {
      const { iStart, iEnd, jStart, jEnd } =
        this.getSegmentCoordinates(segment);
      for (let y = iStart; y <= iEnd; y++) {
        for (let z = jStart; z <= jEnd; z++) {
          this.#data[z][y] = { value: -1 };
        }
      }
    }

    async #initializeNumbers(N = 0, fallback = 0, segment = 0) {
      for (let i = N; i < 9; i++) {
        const { iStart, iEnd, jStart, jEnd } = this.getSegmentCoordinates(i);
        for (let y = iStart; y <= iEnd; y++) {
          for (let z = jStart; z <= jEnd; z++) {
            const newN = this.#getRand(
              this.#getAllNumbersInVicinity(z, y, i),
              9,
              1,
              true
            );
            if (newN === null) {
              fallback = i === segment ? fallback + 1 : fallback;
              for (let f = 0; f <= fallback; f++)
                this.#resetSegementNumbers(i - f);
              return this.#initializeNumbers(i - fallback, fallback, i);
            }
            this.#data[z][y] = { value: newN, validMove: true, inactive: true };
          }
        }
        fallback = 0;
      }
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (this.#getRand([], 3, 1) % 3) {
            this.#data[j][i] = { value: -1 };
            continue;
          }
        }
      }
      this.setStorage("DATA", this.#data);
      this.initializeData(this.#data);
    }
  }
  new Sudoku();
})();
function restart() {
  localStorage.clear();
  window.location.reload();
}

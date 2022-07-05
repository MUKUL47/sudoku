class Sudoku {
  //CONSTANTS
  #KEYPAD = document.querySelector('div[target="keypad"]');
  #CANVAS_ELEMENT = document.querySelector("canvas");
  #context = this.#CANVAS_ELEMENT.getContext("2d");
  #DEFAULT_BORDER = "#8885";
  #THREE_COLOUMNS_BORDER_COLOR = "#888";
  #FONT = "25px arial";
  #THREE_COLOUMNS_WIDTH = "2";
  #BLOCK_SIZE = 50;
  //
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
  #activeButton = -1;
  #youWon = false;
  constructor() {
    this.#initialize();
    this.#initializeListeners();
  }

  #checkIfValidMove(i, j, n) {
    return !this.#getAllNumbersInVicinity(
      i,
      j,
      this.#getSegment(i, j)
    ).includes(Number(n));
  }

  #initializeListeners() {
    this.#CANVAS_ELEMENT.addEventListener(
      "mousedown",
      ({ clientX, clientY }) => {
        if (this.#youWon) return;
        const { left, top } = this.#CANVAS_ELEMENT.getBoundingClientRect();
        const y = clientX - left;
        const x = clientY - top;
        const Y = Math.floor(y / this.#BLOCK_SIZE);
        const X = Math.floor(x / this.#BLOCK_SIZE);
        let { value, active } = this.#data[Y][X];
        if (this.#activeButton === -1 || (value > -1 && !active)) return;
        let isValidMove = false;
        const _n = Number(this.#activeButton);
        if (value === -1 || value != _n) {
          isValidMove = this.#checkIfValidMove(Y, X, this.#activeButton);
          this.#data[Y][X] = {
            value: _n,
            active: true,
            validMove: isValidMove,
          };
        } else {
          this.#data[Y][X] = { value: -1 };
        }
        this.#insertInputSegment(X, Y, this.#activeButton, isValidMove);
        this.#checkGameover();
      }
    );
    this.#KEYPAD.addEventListener("click", ({ target }) => {
      this.#activeButton = target.getAttribute("value");
      document
        .querySelector('button[selected="true"]')
        ?.removeAttribute("selected");
      target.setAttribute("selected", true);
    });
  }

  #insertInputSegment(X, Y, value, validMove) {
    this.#context.closePath();
    this.#context.fillStyle = "black"; // (validMove && "black") || "red";
    this.#context.clearRect(
      Y * this.#BLOCK_SIZE + 5,
      X * this.#BLOCK_SIZE + 5,
      this.#BLOCK_SIZE - 15,
      this.#BLOCK_SIZE - 15
    );
    if (this.#data[Y][X].value === -1) {
      this.#context.fillText(
        "",
        Y * this.#BLOCK_SIZE + 17,
        X * this.#BLOCK_SIZE + 35
      );
    } else {
      this.#context.fillText(
        value,
        Y * this.#BLOCK_SIZE + 17,
        X * this.#BLOCK_SIZE + 35
      );
    }
    this.#context.stroke();
  }

  #correctVicinitySegmentNumbers(i, j, n, isValid) {
    //iterate
    // for (let k = 0; k < 9; k++) {
    //   if (
    //     this.#data[k][j]?.value > -1 &&
    //     this.#data[k][j]?.active &&
    //     this.#data[k][j]?.value === n
    //   ) {
    //     this.#insertInputSegment(k, j, n, isValid);
    //   }
    //   if (
    //     this.#data[j][k]?.value > -1 &&
    //     this.#data[j][k]?.active &&
    //     this.#data[j][k]?.value === n
    //   ) {
    //     this.#insertInputSegment(j, k, n, isValid);
    //   }
    // }
    let { iStart, iEnd, jStart, jEnd } = this.#getSegmentCoordinates(
      this.#getSegment(i, j)
    );
    for (let i = iStart; i <= iEnd; i++) {
      for (let j = jStart; j <= jEnd; j++) {
        const { active, value } = this.#data[j][i];
        if (value > 0 && active && value === n) {
          this.#insertInputSegment(i, j, value, isValid);
        }
      }
    }
  }
  #checkGameover() {
    if (
      this.#data.flat().filter(({ value, validMove }) => value > 0 && validMove)
        .length === 81
    ) {
      setTimeout(() => alert("YOU WON"));
      this.#youWon = true;
    }
  }

  #initialize() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.#context.strokeStyle = this.#DEFAULT_BORDER;
        this.#context.rect(
          i * this.#BLOCK_SIZE,
          j * this.#BLOCK_SIZE,
          this.#BLOCK_SIZE,
          this.#BLOCK_SIZE
        );
      }
    }
    this.#context.stroke();
    this.#context.beginPath();
    this.#context.strokeStyle = this.#THREE_COLOUMNS_BORDER_COLOR;
    this.#context.lineWidth = this.#THREE_COLOUMNS_WIDTH;
    this.#context.moveTo(this.#BLOCK_SIZE * 3, 0);
    this.#context.lineTo(this.#BLOCK_SIZE * 3, this.#BLOCK_SIZE * 9);
    this.#context.moveTo(this.#BLOCK_SIZE * 6, 0);
    this.#context.lineTo(this.#BLOCK_SIZE * 6, this.#BLOCK_SIZE * 9);
    this.#context.moveTo(this.#BLOCK_SIZE * 6, 0);
    this.#context.lineTo(this.#BLOCK_SIZE * 6, this.#BLOCK_SIZE * 9);
    this.#context.moveTo(0, this.#BLOCK_SIZE * 3);
    this.#context.lineTo(this.#BLOCK_SIZE * 9, this.#BLOCK_SIZE * 3);
    this.#context.moveTo(0, this.#BLOCK_SIZE * 6);
    this.#context.lineTo(this.#BLOCK_SIZE * 9, this.#BLOCK_SIZE * 6);
    this.#context.stroke();
    //
    this.#initializeNumbers();
  }

  #getSegment = (i, j) => {
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

  #getSegmentCoordinates(index) {
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

  #setNumberOnSegment(i, j, n) {
    this.#context.beginPath();
    this.#context.fillStyle = "#0001";
    this.#context.fillRect(
      i * this.#BLOCK_SIZE,
      j * this.#BLOCK_SIZE,
      this.#BLOCK_SIZE,
      this.#BLOCK_SIZE
    );
    this.#context.fillStyle = "#0000ff";
    this.#context.font = this.#FONT;
    this.#context.beginPath();
    this.#context.fillText(
      n,
      i * this.#BLOCK_SIZE + 17,
      j * this.#BLOCK_SIZE + 35
    );
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
      this.#getSegmentCoordinates(segmentIndex);
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
    const { iStart, iEnd, jStart, jEnd } = this.#getSegmentCoordinates(segment);
    for (let y = iStart; y <= iEnd; y++) {
      for (let z = jStart; z <= jEnd; z++) {
        this.#data[z][y] = { value: -1 };
      }
    }
  }

  async #initializeNumbers(N = 0, fallback = 0, segment = 0) {
    for (let i = N; i < 9; i++) {
      const { iStart, iEnd, jStart, jEnd } = this.#getSegmentCoordinates(i);
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
          this.#data[z][y] = { value: newN, validMove: true };
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
        this.#setNumberOnSegment(j, i, this.#data[j][i].value);
      }
    }
  }
}

new Sudoku();

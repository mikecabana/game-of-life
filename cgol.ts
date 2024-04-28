const gridEl = document.getElementById('grid') as HTMLElement;
const startBtnEl = document.getElementById('startBtn') as HTMLButtonElement;
const stopBtnEl = document.getElementById('stopBtn') as HTMLButtonElement;
stopBtnEl.disabled = true;
let running = false;

class Square {
    constructor(public alive = false) {
        this.alive = alive;
    }

    toggle() {
        this.alive = !this.alive;
    }
}

class GameOfLife {
    width: number;
    height: number;
    board: Square[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.board = this.initializeBoard();
    }

    initializeBoard(): Square[][] {
        const board: Square[][] = [];

        for (let i = 0; i < this.height; i++) {
            const row: Square[] = [];
            for (let j = 0; j < this.width; j++) {
                // const isAlive = Math.random() < 0.5;
                // row.push(new Square(isAlive));
                row.push(new Square());
            }
            board.push(row);
        }

        return board;
    }

    printBoardConsole() {
        for (let i = 0; i < this.height; i++) {
            let row = '';
            for (let j = 0; j < this.width; j++) {
                row += this.board[i][j].alive ? 'X ' : '. ';
            }
            console.log(row);
        }
    }

    private createRowEl() {
        const rowEl = document.createElement('div');
        rowEl.classList.add('row');
        return rowEl;
    }

    private createCellEl() {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        return cellEl;
    }

    private toggleCellEl(el: HTMLElement, alive: boolean) {
        if (alive) {
            el.classList.add('alive');
        } else {
            el.classList.remove('alive');
        }
    }

    printBoardDom() {
        gridEl.innerHTML = '';
        for (let i = 0; i < this.height; i++) {
            const rowEl = this.createRowEl();
            for (let j = 0; j < this.width; j++) {
                const cellEl = this.createCellEl();
                this.toggleCellEl(cellEl, this.board[i][j].alive);
                cellEl.addEventListener('click', () => {
                    if (!running) {
                        this.board[i][j].toggle();
                        this.toggleCellEl(cellEl, this.board[i][j].alive);
                    }
                });
                rowEl.append(cellEl);
            }
            gridEl?.append(rowEl);
        }
    }

    countAliveNeighbors(x: number, y: number): number {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborX = x + i;
                const neighborY = y + j;
                if (
                    neighborX >= 0 &&
                    neighborX < this.height &&
                    neighborY >= 0 &&
                    neighborY < this.width &&
                    !(i === 0 && j === 0)
                ) {
                    if (this.board[neighborX][neighborY].alive) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    updateBoard() {
        const newBoard: Square[][] = [];
        for (let i = 0; i < this.height; i++) {
            const newRow: Square[] = [];
            for (let j = 0; j < this.width; j++) {
                const aliveNeighbors = this.countAliveNeighbors(i, j);
                const currentSquare = this.board[i][j];
                let newSquareState = false;
                if (currentSquare.alive) {
                    // Any live Square with fewer than two live neighbors dies, as if by underpopulation.
                    // Any live Square with more than three live neighbors dies, as if by overpopulation.
                    newSquareState = aliveNeighbors === 2 || aliveNeighbors === 3;
                } else {
                    // Any dead Square with exactly three live neighbors becomes a live Square, as if by reproduction.
                    newSquareState = aliveNeighbors === 3;
                }
                newRow.push(new Square(newSquareState));
            }
            newBoard.push(newRow);
        }
        this.board = newBoard;
    }
}

const width = 80;
const height = 40;

const game = new GameOfLife(width, height);
let intervalRef: number | null = null;

function startSimulation() {
    startBtnEl.disabled = true;
    stopBtnEl.disabled = false;
    intervalRef = setInterval(() => {
        game.printBoardDom();
        game.updateBoard();
    }, 250);
}

function stopSimulation() {
    startBtnEl.disabled = false;
    stopBtnEl.disabled = true;
    clearInterval(intervalRef as number);
    game.printBoardDom();
}

game.printBoardDom();
startBtnEl?.addEventListener('click', () => startSimulation());
stopBtnEl?.addEventListener('click', () => stopSimulation());

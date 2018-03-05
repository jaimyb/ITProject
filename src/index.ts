require('./index.html');
require('./style/stylesheet.css');
const $ = require("jquery");

const diceLetters = [
    ['R', 'I', 'F', 'O', 'B', 'X'],
    ['I', 'F', 'E', 'H', 'E', 'Y'],
    ['D', 'E', 'N', 'O', 'W', 'S'],
    ['U', 'T', 'O', 'K', 'N', 'D'],
    ['H', 'M', 'S', 'R', 'A', 'O'],
    ['L', 'U', 'P', 'E', 'T', 'S'],
    ['A', 'C', 'I', 'T', 'O', 'A'],
    ['Y', 'L', 'G', 'K', 'U', 'E'],
    ['Q', 'B', 'M', 'J', 'O', 'A'],
    ['E', 'H', 'I', 'S', 'P', 'N'],
    ['V', 'E', 'T', 'I', 'G', 'N'],
    ['B', 'A', 'L', 'I', 'Y', 'T'],
    ['E', 'Z', 'A', 'V', 'N', 'D'],
    ['R', 'A', 'L', 'E', 'S', 'C'],
    ['U', 'W', 'I', 'L', 'R', 'G'],
    ['P', 'A', 'C', 'E', 'M', 'D']
];

declare var board;

$( document ).ready(function() {
    StartGame();

});

function StartGame(){
    board = new Board;
}

$('#button').click(function () {
    board.GenerateBoard();
});



class Board{
    rows: HTMLDivElement[];
    dice: Array<Array<Die>>;

    constructor(){
        this.rows = new Array<HTMLDivElement>();
        this.dice = new Array<Array<Die>>();
        this.InitRows();
        this.GenerateBoard();
    }

    InitRows(){
        for(let a = 0; a < 4; a++){
            let row = document.createElement('div');
            row.setAttribute('type', 'div');
            row.setAttribute('id', "boggle_row_" + a);
            row.setAttribute('class',"section group boggle_row");
            this.rows.push(row);
        }
    }

    GenerateBoard(){
        let count = 0; 

        $('.dice').remove();
        $('.boggle_row').remove();

        for(let a = 0; a < 4; a++) {
            let row = [];
            for(let b = 0; b < 4; b++){
                let die = new Die(count);
                row.push(die);
                count++;  
            }
            this.dice.push(row);
        }

        for(let a = 0; a < 4; a++) {
            $("#button_grid").append(this.rows[a]);
            for(let b = 0; b < 4; b++){
                $('#boggle_row_' + a).append(this.dice[a][b].buttonElement);
            }
        }
    }
    
}

class Die{
    currentLetter: string;
    letters: string[];
    id: number;
    buttonElement: HTMLButtonElement;

    constructor(id: number){
        this.letters = diceLetters[id];
        this.id = id;
        this.buttonElement = document.createElement('button');
        this.buttonElement.setAttribute('id', id.toString());
        this.buttonElement.setAttribute('type', 'button');
        this.buttonElement.setAttribute('class',"col span_1_of_4 dice");
        this.GetRandomLetter();
    }

    GetRandomLetter() {
        var letter = this.letters[Math.floor((Math.random() * 6) + 0)];
        this.buttonElement.innerHTML = letter;
    }
}
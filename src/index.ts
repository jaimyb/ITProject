require('./index.html');
const $ = require("jquery");

const boards = 20;

const dice = [
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

let buttons = [];



$( document ).ready(function() {
    GenerateButtons();
});


function GenerateBoard() {
    let a = 0;
    let b = 0;

    for(a = 0; a <= 4; a++){
        let row = document.createElement('div');
        row.setAttribute('type', 'div');
        row.setAttribute('id', "boggle_row_" + a);
        row.setAttribute('class',"section group");
        var button_grid = $("#button_grid");
        button_grid.appendChild(row);
        for(b = 0; b <= 4; b++){
            $('#boggle_row_' + b).appendChild(buttons[a][b]);
        }
    }
}

function DiceClicked(){
    alert("working!");
}

function GenerateButtons() {
    let count = 0;
    let a = 0;
    let b = 0;

    for(a = 0; a <=4; a++) {
        let row = [];
        for(b = 0; b <=4; b++){
            let diceNumber = Math.floor((Math.random() * 6) + 0);
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.setAttribute('text', ('test'));
            btn.setAttribute('onclick', "DiceClicked()");
            btn.setAttribute('id', "boggle_button_" + count);
            btn.setAttribute('class',"col span_1_of_4 dice");
            row.push(btn);
            count++;
        }
        buttons.push(row);
    }
    GenerateBoard();
}


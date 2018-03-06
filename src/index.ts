import { setInterval } from "timers";

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

var board;
var maxRounds;
var currentRound;
var points;
var round;
var timer;
var selectedDice;
var test;

$( document ).ready(function() 
{
    StartGame();
    $('.dice').click(function(e){
        CheckInput(e.target.id);
    });
    $('#checkWordButton').click(function(e){
        CheckWord();
    });
});

function StartGame()
{
    board = new Board;
    timer = 180;
    maxRounds = 20;
    round = 1;
    selectedDice = new Array<Die>();
    points = 0;
    createTimer();
    createCheckButton();
}

function NextRound()
{
    timer = 180;
    document.getElementById('timer').setAttribute('value',timer); 
    if(round == maxRounds){
        round = 0;
    }
    board.GenerateBoard();
    round++;
}

function CheckWord(){
    if(selectedDice.length < 3){
        alert("Please select a word that is longer then 2 characters!");
    }
    if(selectedDice.length >= 8){
        points = points + Number(11)
    }
    else{
        switch(selectedDice.length){
            case 3:
                points++;
            break;
            case 4:
                points++;
                console.log(points);
            break;
            case 5:
                points = points + Number(2);
            break;
            case 6:
                points = points + Number(3)
            break;
            case 7:
                points = points + Number(5)
            break;
            default:
            alert("Please select a word that is longer then 2 characters!");
            break;
        }
    }
    console.log(points);
    document.getElementById("points").innerHTML = points;
}

function createCheckButton(){
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', "checkWordButton");
    button.innerHTML = "Check Word"
    $(".game_info").append(button);

    let pointsDiv = document.createElement('div');
    pointsDiv.setAttribute('type', 'div');
    pointsDiv.setAttribute('id', "points");
    pointsDiv.innerHTML = points;
    $(".game_info").append(pointsDiv);
}

function createTimer(){
    let timerDiv = document.createElement('progress');
    timerDiv.setAttribute('type', 'progress');
    timerDiv.setAttribute('id', "timer");
    timerDiv.setAttribute('max','180');
    $(".game_info").append(timerDiv);

    setInterval(function(){ 
        timer--;
         document.getElementById('timer').setAttribute('value',timer);
         if(timer <= 0){
            NextRound();
        }
    }, 1000);
}

function CheckInput(id){
    if(selectedDice.length == 0)
    {
        selectedDice.push(board.dice[id]);
         $('#' + id).css("background-color","green");
        return true;
    }
    if(selectedDice.indexOf(board.dice[id]) < 0){
        let lowestRow = board.dice[id].row - 1;
        let highestRow = board.dice[id].row + 2;
        if(board.dice[id].row == 0){
            lowestRow = board.dice[id].row;
        }
        if(board.dice[id].row == 3){
            highestRow = board.dice[id].row + 1;
        }     
        for(lowestRow; lowestRow < highestRow; lowestRow++){
            let lowestColumn = board.dice[id].column - 1;
            let highestColumn = board.dice[id].column + 2;
            if(board.dice[id].column == 0){
                lowestColumn = board.dice[id].column;
            }
            if(board.dice[id].column == 3){
                highestColumn = board.dice[id].column + 1;
            }
            console.log(lowestRow + ',' +lowestColumn);
            for(lowestColumn; lowestColumn < highestColumn; lowestColumn++){
                if(board.board[lowestRow][lowestColumn] == selectedDice[selectedDice.length - 1]){
                    selectedDice.push(board.dice[id]);
                    $('#' + id).css("background-color","green");
                    return true;            
                }
            }
        }
        alert("Please select the letters in sequence!");
        return false;
    }
    if(id == selectedDice[selectedDice.length - 1].id){
        selectedDice.pop();
        $('#' + id).css("background-color","white");
    }
}

class Board{
    rows: HTMLDivElement[];
    board: Array<Array<Die>>;
    dice: Array<Die>;

    constructor(){
        this.rows = new Array<HTMLDivElement>();
        this.board = new Array<Array<Die>>();
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
        console.log("Genrateboard");
        this.board = new Array<Array<Die>>();
        this.dice = new Array<Die>();
        let count = 0; 

        $('.dice').remove();
        $('.boggle_row').remove();

        for(let a = 0; a < 4; a++) {
            let row = [];
            for(let b = 0; b < 4; b++){
                let die = new Die(count);
                die.GetRandomLetter();
                row.push(die);
                die.row = a;
                die.column = b;
                this.dice.push(die);
                count++;  
            }
            this.board.push(row);
        }

        for(let a = 0; a < 4; a++) {
            $("#button_grid").append(this.rows[a]);
            for(let b = 0; b < 4; b++){
                $('#boggle_row_' + a).append(this.board[a][b].buttonElement);
            }
        }
    }
    
}

class Die{
    currentLetter: string;
    letters: string[];
    id: number;
    row: number;
    column: number;
    selected: boolean;
    buttonElement: HTMLButtonElement;

    constructor(id: number){
        this.letters = diceLetters[id];
        this.id = id;
        this.buttonElement = document.createElement('button');
        this.buttonElement.setAttribute('id', id.toString());
        this.buttonElement.setAttribute('type', 'button');
        this.buttonElement.setAttribute('class',"col span_1_of_4 dice");
    }

    GetRandomLetter() {
        var letter = this.letters[Math.floor((Math.random() * 6) + 0)];
        this.buttonElement.innerHTML = letter;
        console.log("Randomletter:" + letter + this.id);
    }
}
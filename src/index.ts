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

let game;

$(document).ready(function() 
{
    console.log("ready");
    game = new Game(20);
    $('.dice').click(function(e){
        game.CheckInput(e.target.id);
    });
    $('#checkWordButton').click(function(e){
        game.CheckWord();
    });
    $('#getJSON').click(function(e){
        // let request = new XMLHttpRequest();
        // request.open('GET', 'http://localhost:60483/api/todo/', true);
        // request.onload = function () {
        // console.log(this.response);
        // JSON.parse(this.response);
        // }      
        // request.send();
        $.ajax({
            url: 'http://localhost:60483/api/todo',
            type: 'GET',
            dataType: 'jsonp',            
            success: function (data) {              
                console.log(data.Name);
            },
        });           
    });
});

function generateCheckWordElement(){
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', "checkWordButton");
    button.innerHTML = "Check Word"
    $(".game_info").append(button);
}

function generatePointsElement(){
    let pointsDiv = document.createElement('div');
    pointsDiv.setAttribute('type', 'div');
    pointsDiv.setAttribute('id', "points");
    pointsDiv.innerHTML = 'Points: 0';
    $(".game_info").append(pointsDiv);
}

function generateRoundElement(){
    let round = document.createElement('div');
    round.setAttribute('type', 'div');
    round.setAttribute('id', "round");
    round.innerHTML = 'Round: 0';
    $(".game_info").append(round);
}

function generateTimerElement(){
    let timerDiv = document.createElement('progress');
    timerDiv.setAttribute('type', 'progress');
    timerDiv.setAttribute('id', "timer");
    timerDiv.setAttribute('max','180');
    $(".game_info").append(timerDiv);

    setInterval(function(){ 
        game.timer--;
         document.getElementById('timer').setAttribute('value',game.timer);
         if(game.timer <= 0){
            game.NextRound();
            game.timer = 180;
        }
    }, 1000);
}


class Game{
    round: number;
    maxRounds: number;
    board: Board;
    points: number;
    selectedDice: Array<Die>;
    timer: number;

    constructor(maxRounds: number){
        this.maxRounds = maxRounds;
        this.round = 0;
        this.points = 0;
        this.timer = 180;
        this.selectedDice = new Array<Die>();
        this.board = new Board();
        this.StartGame();
    }

    StartGame(){
        generateRoundElement();
        generatePointsElement();
        generateTimerElement();
        generateCheckWordElement();    
    }

    CheckWord(){
        if(this.selectedDice.length >= 8){
            this.points = this.points + Number(11)
        }
        else{
            switch(this.selectedDice.length){
                case 3:
                    this.points++;
                break;
                case 4:
                    this.points++;
                break;
                case 5:
                    this.points = this.points + Number(2);
                break;
                case 6:
                    this.points = this.points + Number(3)
                break;
                case 7:
                    this.points = this.points + Number(5)
                break;
                default:
                alert("Please select a word that is longer then 2 characters!");
                break;
            }   
        }
        document.getElementById("points").innerHTML = "Points: " + this.points.toString();
        this.selectedDice = [];
        $('.dice').removeClass('selected');
    }

    CheckInput(id){
        if(this.selectedDice.length == 0)
        {
            this.selectedDice.push(this.board.dice[id]);
             $('#' + id).addClass('selected');
            return true;
        }
        if(this.selectedDice.indexOf(this.board.dice[id]) < 0){
            let lowestRow = this.board.dice[id].row - 1;
            let highestRow = this.board.dice[id].row + 2;
            if(this.board.dice[id].row == 0){
                lowestRow = this.board.dice[id].row;
            }
            if(this.board.dice[id].row == 3){
                highestRow = this.board.dice[id].row + 1;
            }     
            for(lowestRow; lowestRow < highestRow; lowestRow++){
                let lowestColumn = this.board.dice[id].column - 1;
                let highestColumn = this.board.dice[id].column + 2;
                if(this.board.dice[id].column == 0){
                    lowestColumn = this.board.dice[id].column;
                }
                if(this.board.dice[id].column == 3){
                    highestColumn = this.board.dice[id].column + 1;
                }
                console.log(lowestRow + ',' +lowestColumn);
                for(lowestColumn; lowestColumn < highestColumn; lowestColumn++){
                    if(this.board.board[lowestRow][lowestColumn] == this.selectedDice[this.selectedDice.length - 1]){
                        this.selectedDice.push(this.board.dice[id]);
                        $('#' + id).addClass('selected');
                        return true;            
                    }
                }
            }
            alert("Please select the letters in sequence!");
            return false;
        }
        if(id == this.selectedDice[this.selectedDice.length - 1].id){
            this.selectedDice.pop();
            $('#' + id).removeClass('selected');
        }
    }

    NextRound(){
        this.timer = 5;
        document.getElementById('timer').setAttribute('value',this.timer.toString()); 
        if(this.round == this.maxRounds){
            this.round = 0;
            this.points = 0;
            alert("The game has ended! Your score: " + this.points.toString())
        }
        this.board.GenerateBoard();
        this.round++;
        document.getElementById('round').innerHTML = "Round: " + this.round.toString(); 
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
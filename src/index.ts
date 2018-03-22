import { setInterval } from "timers";
var moment = require('moment');

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
    generateHomePage();    
});

function generateHomePage(){
    generateStartGameButton();
    generatePlayerNameInput();
}

function generateStartGameButton(){
    let startgameButton = document.createElement('button');
    startgameButton.setAttribute('type', 'button');
    startgameButton.setAttribute('id', "start_game");
    startgameButton.innerHTML = 'Start Game';
    $(".game_info").append(startgameButton);

    $('#start_game').click(function(e){
        var playerName = $("#player_name_input").val();
        game = new Game(playerName as string);
        $("#player_name_input").remove();
        $("#player_name").remove();
        $("#start_game").remove();
    });
}

function generatePlayerNameInput(){
    let playerName = document.createElement('div');
    playerName.setAttribute('type', 'div');
    playerName.setAttribute('id', "player_name");
    playerName.style.display = "inline-block"
    playerName.innerHTML = "Player:";
    $(".game_info").append(playerName);


    let playerNameInput = document.createElement('input');
    playerNameInput.setAttribute('type', 'input');
    playerNameInput.setAttribute('id', "player_name_input");
    playerNameInput.style.minWidth = "50px"
    $(".game_info").append(playerNameInput);
}


function generateCheckWordElement(){
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', "checkWordButton");
    button.innerHTML = "Check Word"
    $(".game_info").append(button);
    
    $('#checkWordButton').click(function(e){
        console.log("checkword click");
        game.CheckWord();
    });
}

function generatePointsElement(){
    let pointsDiv = document.createElement('div');
    pointsDiv.setAttribute('type', 'div');
    pointsDiv.setAttribute('id', "points");
    pointsDiv.innerHTML = 'Points: 0';
    $(".game_info").append(pointsDiv);
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
         if(game.timer == 0){
            game.EndGame();
        }
    }, 1000);
}


class Game{
    board: Board;
    points: number;
    selectedDice: Array<Die>;
    timer: number;
    player: string;

    constructor(playerName: string){
        this.points = 0;
        this.timer = 5;
        this.player = playerName;
        this.selectedDice = new Array<Die>();
        this.StartGame();
    }

    StartGame(){
        generatePointsElement();
        generateTimerElement();
        generateCheckWordElement();
        this.board = new Board();    
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

    EndGame(){
        document.getElementById('timer').setAttribute('value',this.timer.toString()); 
        alert("The game has ended! Your score: " + this.points.toString());
        this.saveBoard();        
        this.RemoveGameUi();
        generateHomePage();
    }

    saveBoard(){
        let Board = {Player: this.player, Date: moment().format('L'), Dies: [], Score: this.points};
    
        for(let a = 0; a < this.board.dice.length; a++){
            var die = {Letter: this.board.dice[a].currentLetter};
            Board.Dies.push(die);
        }
        
        console.log("Board posted to server:")
        console.log(Board);
    
        $.ajax({
            type: 'POST',
            async: true,
            url: 'http://localhost:49885/api/boards',
            contentType: 'application/json; charset=UTF-8',  //send type of data to sever
            dataType: 'text', //retrun type of data from server
            data: JSON.stringify(Board),
            success: function (response, statusText, xhr) {
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {                       
                alert(XMLHttpRequest.responseText);
    
            }
        });
    }

    RemoveGameUi()
    {
        $('#timer').remove();
        $('.dice').remove();
        $('#points').remove();
        $('.boggle_row').remove();
        $('#checkWordButton').remove();
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
        this.board = new Array<Array<Die>>();
        this.dice = new Array<Die>();
        let count = 0; 

        $('.dice').remove();
        $('.boggle_row').remove();

        var arr = []
        while(arr.length < 16){
            var randomnumber = Math.floor(Math.random()*16);
            if(arr.indexOf(randomnumber) > -1) continue;
            console.log(randomnumber);
            arr[arr.length] = randomnumber;
        }

        for(let a = 0; a < 4; a++) {
            let row = [];
            for(let b = 0; b < 4; b++){
                let die = new Die(count);
                die.GetRandomLetter(arr[count]);
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

        $('.dice').click(function(e){
            console.log("dice click");
            game.CheckInput(e.target.id);
        });
        
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

    GetRandomLetter(seed: Number) {
        var letter = this.letters[Math.floor((Math.random() * 6) + 0)];
        this.buttonElement.innerHTML = letter;
        this.currentLetter = letter;
    }
}
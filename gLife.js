/*
1 Any live cell with fewer than two live neighbors dies, as if by underpopulation.
2 Any live cell with two or three live neighbors lives on to the next generation.
3 Any live cell with more than three live neighbors dies, as if by overpopulation.
4 Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var cLarg = canvas.width;
var cAlt = canvas.height;
var prev = [];
var next = [];
var nColum =75;
var nLin = 50;
var prox = document.getElementById("prox");
var play = document.getElementById("play");
var stop = document.getElementById("stop");
var vel = document.getElementById("vel").value;
var a = false;

class Cell {
  constructor(x, y, w, h, state) {
    this.x = x; //Posição do CANTO da célula
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = state;
  }
  draw(){
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "solid black";
    if (this.state){
      ctx.fillStyle = "#44e744";
    }else{
      ctx.fillStyle = "rgb(255, 255, 255)";
    }
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  checkMouse(){
    let mouseX = event.clientX + scrollX;
    let mouseY = event.clientY + scrollY;
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h){
      return true;
    }else{
      return false;
    }
  }
}
function createBlank() {
  if (a){
    window.clearInterval(anima);
  }

  ctx.clearRect(0, 0, cLarg, cAlt);
  prev = [];
  for (let i = 0; i < nLin; i++){
    var linha = [];
    for(let j = 0; j < nColum; j++){
      if (i == 0 || j == 0 || i == nLin - 1 || j == nColum - 1){
        var cell = new Cell(0, 0, 0, 0, 0);
      }else{
        var cell = new Cell(j * (cLarg / nColum) , i * (cAlt / nLin), cLarg / nColum, cAlt / nLin, 0);
        cell.draw();
      }
      linha.push(cell);
    }
    prev.push(linha);
  }
  prox.style = "display: block";
  play.style = "display: inline";
  stop.style = "display: inline";
}

function godHand() {
  for (let i = 1; i < prev.length - 1; i++){
    for (let j = 1; j <prev.length - 1; j++){
      if (prev[i][j].checkMouse()){
        if (prev[i][j].state){
            prev[i][j].state = 0;
        }else{
          prev[i][j].state = 1;
        }
        ctx.clearRect(prev[i][j].x - 1, prev[i][j].y - 1, prev[i][j].w + 1, prev[i][j].h + 1);
        prev[i][j].draw();
      }
    }
  }
}

function createRandomCells() {
  if (a){
    window.clearInterval(anima);
  }

  ctx.clearRect(0, 0, cLarg, cAlt);
  prev = [];
  for (let i = 0; i < nLin; i++){
    var linha = [];
    for(let j = 0; j < nColum; j++){
      if (i == 0 || j == 0 || i == nLin - 1 || j == nColum - 1){
        var cell = new Cell(0, 0, 0, 0, 0);
      }else{
        var cell = new Cell(j * (cLarg / nColum) , i * (cAlt / nLin), cLarg / nColum, cAlt / nLin, Math.round(Math.random()));
        cell.draw();
      }
      linha.push(cell);
    }
    prev.push(linha);
  }
  prox.style = "display: block";
  play.style = "display: inline";
  stop.style = "display: inline";
}

function nextGen() {
  ctx.clearRect(0, 0, cLarg, cAlt);
  for (var i = 1; i < nLin - 1; i++){
    var linha = [];
    for (var j = 1; j < nColum - 1; j++){
      var live = 0;
      var neib = vizinhos(prev, i, j);
      if (i != 0 || j != 0 || i != nLin - 1 || j != nColum - 1){
        for (var k = 0; k < neib.length; k++){
          if (neib[k].state){
            live++;
          }
        }
      }
      if (prev[i][j].state && (live < 2 || live > 3)){ //Regras 1 e 3
        var cell = new Cell(prev[i][j].x, prev[i][j].y, prev[i][j].w, prev[i][j].h, 0);
      }else if (prev[i][j].state && (live == 2 || live == 3)){ // Regra 2
        var cell = new Cell(prev[i][j].x, prev[i][j].y, prev[i][j].w, prev[i][j].h, 1);
      }else if (!prev[i][j].state && live == 3){ // Regra 4
        var cell = new Cell(prev[i][j].x, prev[i][j].y, prev[i][j].w, prev[i][j].h, 1);
      }else if (!prev[i][j].state && live != 3){
        var cell = new Cell(prev[i][j].x, prev[i][j].y, prev[i][j].w, prev[i][j].h, 0)
      }
      cell.draw();
      linha.push(cell);
    }
    linha.push(new Cell(0, 0, 0, 0, 0));
    linha.unshift(new Cell(0, 0, 0, 0, 0));
    next.push(linha);
  }
  var auxLinha = []
  for (let p = 0; p < nColum; p++){
    auxLinha.push(new Cell(0, 0, 0, 0, 0));
  }
  next.push(auxLinha);
  next.unshift(auxLinha);
  prev = next;
  next = [];
}











function vizinhos(matriz, i, j) {
  return [matriz[i - 1][j - 1], matriz[i - 1][j], matriz[i - 1][j + 1], matriz[i][j - 1], matriz[i][j + 1], matriz[i + 1][j - 1], matriz[i + 1][j], matriz[i + 1][j + 1]];
}

// function debug() {
//   console.log(prev[1][1])
//   ctx.arc(prev[1][1].x, prev[1][1].y, 10, 0, 6.28);
//   ctx.stroke();
// }

function autom() {
  vel = document.getElementById("vel").value;
  anima = window.setInterval(nextGen, vel);
  a = true;
}

function pause(){
    window.clearInterval(anima);
}

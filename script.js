let canvas = document.getElementById("myCanvas") ;
let context = canvas.getContext("2d") ;
let button = document.getElementById("play") ;
let countBTN = document.getElementById("count") ;
const FPS =30 ;
let w = 20 ;
let state=true ;
canvas.setAttribute("width" ,(window.innerWidth-window.innerWidth%w-2*w).toString());
let cols = Math.floor(canvas.width/w);
let rows = Math.floor(canvas.height/w) ;
let game;
let rndBTN = document.getElementById("randomize") ;
let generation=document.getElementById("generation") ;
let clearBTN = document.getElementById("clearing") ;
let nbBTN = document.getElementById("number") ;
clearBTN.addEventListener("click" , clear) ;
button.addEventListener("click" , begin) ;
canvas.addEventListener("click" , makeItLive) ;
countBTN.addEventListener("click" , countN) ;
rndBTN.addEventListener("click" , random) ;
generation.addEventListener("click" , reinitialize) ;
nbBTN.addEventListener("click", ()=> {
    if (state) {
        state = false;
        nbBTN.innerHTML = "show Numbers";

    } else {
        state = true;
        nbBTN.innerHTML = "clear Numbers";

    }
});
let grid = new Array(cols) ;
for(let i=0 ; i<cols;i++){
    grid[i] = new Array(rows) ;
}
let next = new Array(cols) ;
for(let i=0 ; i<cols;i++){
    next[i] = new Array(rows) ;
}
let neighbors = new Array(cols) ;
for(let i=0 ; i<cols;i++){
    neighbors[i] = new Array(rows) ;
}

for(let i = 0 ; i<cols;i++){
    for(let j=0 ; j<rows;j++){
            grid[i][j] = 0;
    }
}
for(let i = 0 ; i<cols;i++){
    for(let j=0 ; j<rows;j++){
        neighbors[i][j] = countNeighbors(grid,i,j);
    }
}

setInterval(show , 1000/FPS) ;

function show() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            context.strokeStyle = "white";
            context.strokeRect(w * i, w * j, w, w);
            context.stroke();
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if(grid[i][j]) {
                context.fillStyle = "white";
                context.fillRect(w * i, w * j, w, w);
            }
        }
    }
    if(state) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                    context.fillStyle = "red";
                    context.font="10px Arial " ;
                    context.fillText(countNeighbors(grid,i,j).toString(), w * i +w/2, w*j+w/2);
            }
        }
    }

}
function moveGeneration() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let n = countNeighbors(grid, i, j);
            if (grid[i][j] === 0 && n === 3)
                next[i][j] = 1;
            else if (grid[i][j] === 1 && (n < 2 || n > 3))
                next[i][j] = 0;
            else
                next[i][j] = grid[i][j];
        }
    }
    let test=true ;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if(grid[i][j]!==next[i][j])
                test=false ;
            grid[i][j]=next[i][j] ;
        }
    }
    if(!test)
    generation.innerHTML=(parseInt(generation.innerHTML)+1).toString();
    if(test) {
        clearInterval(game);
        button.addEventListener("click", begin);
        rndBTN.addEventListener("click", random);
        canvas.addEventListener("click", makeItLive);
        clearBTN.addEventListener("click" ,clear ) ;
        generation.addEventListener("click" , reinitialize) ;
    }
}
function countNeighbors(grid,i,j) {
    let s=0;
    for(let a=-1 ; a<2  ;a++){
        for(let b=-1 ; b<2;b++){
            try {
                if (grid[i + a][j + b])
                    s++
            } catch (e) {
                
            }
        }
    }
    s-=grid[i][j] ;
    return s ;
}

function begin() {
    //moveGeneration();
    game=setInterval(moveGeneration , 100) ;
    button.removeEventListener("click" , begin) ;
    button.innerHTML="stop" ;
    button.addEventListener("click" , stop) ;
    rndBTN.removeEventListener("click" , random) ;
    canvas.removeEventListener("click" , makeItLive) ;
    clearBTN.removeEventListener("click" , clear) ;
    generation.removeEventListener("click" , reinitialize) ;
}

function stop() {
    clearInterval(game) ;
    button.removeEventListener("click" , stop) ;
    button.innerHTML="play" ;
    button.addEventListener("click" , begin) ;
    rndBTN.addEventListener("click" , random) ;
    canvas.addEventListener("click" , makeItLive) ;
    clearBTN.addEventListener("click" , clear) ;
    generation.addEventListener("click" , reinitialize) ;
}

function makeItLive(e) {
    console.log(canvas.offsetTop +" "+(e.clientY+document.documentElement.scrollTop) +" "+document.documentElement.scrollTop) ;
    let i =Math.floor(((e.clientX+document.documentElement.scrollLeft)-canvas.offsetLeft)/w);
    let j=Math.floor(((e.clientY+document.documentElement.scrollTop)-canvas.offsetTop)/w);
    grid[i][j] = 1-grid[i][j] ;
}

function countN() {
    for(let i=0 ;i<cols;i++){
        for(let j=0 ; j<rows ;j++){
            neighbors[i][j]=countNeighbors(grid , i , j) ;
        }
    }
}

function random() {
    for(let i=0 ;i<cols;i++){
        for(let j=0 ; j<rows ;j++){
            grid[i][j]=Math.floor(Math.random()*2) ;
        }
    }
}

function clear() {
    for(let i=0 ;i<cols;i++){
        for(let j=0 ; j<rows ;j++){
            grid[i][j]=0 ;
        }
    }
    generation.innerHTML="0";
}

function reinitialize() {
    generation.innerHTML="0";
}
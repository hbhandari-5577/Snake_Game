let inputDir = {x: 0, y: 0}; /* Snake is stationary */

/* music tracks used in game */
const foodSound = new Audio('Music/food.mp3');
const gameOverSound = new Audio('Music/gameover.mp3');
const moveSound = new Audio('Music/move.mp3');
let score = 0;
let speed = 15;
let lastPaintTime = 0; // time when the screen got painted
let snakeArr = [{x: 13, y: 15}]; // position of snake's head
food = {x: 6, y: 7}; // food is a particle here

// Game Functions
function main(ctime)
{
    window.requestAnimationFrame(main);
    // console.log(ctime);
    if((ctime - lastPaintTime)/1000 < 1/speed) // to control FPS of game
    {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake)
{
    for(let i=1; i<snakeArr.length; i++)
    {
        if(snake[i].x===snake[0].x && snake[i].y===snake[0].y) // if snake's head collide with its body
        {
            return true;
        }
    }
    // if snake collides in wall
    if(snake[0].x>=18 || snake[0].x<=0 || snake[0].y>=18 || snake[0].y<=0)
    {
        return true;
    }
    return false;
}

function gameEngine()
{
    // Part 1: Update the snake array and food
    if(isCollide(snakeArr))
    {
        gameOverSound.play();
        inputDir = {x: 0, y: 0};
        alert("Restart Game");
        snakeArr = [{x: 13, y: 15}]; // reset snake in position
        score = 0;
    }

    // if you ate the food, increment the score and re-display the food
    if(snakeArr[0].y===food.y && snakeArr[0].x===food.x) // if snake head and food index are equal
    {
        foodSound.play();
        score += 1; // increment score
        if(score>highScoreVal) // store high score in local storage
        {
            highScoreVal = score;
            localStorage.setItem("High Score: ", JSON.stringify(highScoreVal));
            highScoreBox.innerHTML = "High Score: " + highScoreVal;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y}); // adding body to the snake
        // a and b is the range of grid in which random number will be generated
        let a = 2;
        let b = 16; 
        food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())} // generate food random on div screen
    }

    // Move the snake
    for(let i=snakeArr.length-2; i>=0; i--)
    {
        // in order to remove reference problem (as snakeArr[i] at end, will point to same object), we used (...) object
        snakeArr[i+1] = {...snakeArr[i]}; // all-together new object in which only snakeArr[i] is stored
    }

    // joining the snake body to head and so on...
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the Snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');  // creating snake in div class
        
        /* adding CSS
        x -> column , y -> row */
        snakeElement.style.gridRowStart = e.y; 
        snakeElement.style.gridColumnStart = e.x;
        if(index === 0) // initialize head for first time
        {
            snakeElement.classList.add('head');
        }
        else // adding snake to board
        {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Part 3: Display the Food
    foodElement = document.createElement('div');  // creating food in div class
    
    /* adding CSS
    x -> column , y -> row */
    foodElement.style.gridRowStart = food.y; 
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food'); // adding food to board
    board.appendChild(foodElement);
}

let highScore = localStorage.getItem("High Score: ");
if(highScore === null)
{
    highScoreVal = 0;
    localStorage.setItem("High Score: ", JSON.stringify(highScoreVal)); // making high score in String
}
else
{
    highScoreVal = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScoreVal;
}

window.requestAnimationFrame(main); /* render animation repeatedly */

/* movement keys and movement sound */
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 1} // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0; // velocity of snake when arrow key is pressed
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0; // velocity of snake when arrow key is pressed
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1; // velocity of snake when arrow key is pressed
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1; // velocity of snake when arrow key is pressed
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
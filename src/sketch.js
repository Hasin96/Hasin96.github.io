
var cols, rows;
var w = 50; // size of cells
var grid = [];
var money = 0;

var current;
var player;
var coinTaken = false;
var level = 1;
var enemy;
var enemies = [];
var coins = [];
var enemyCell;
var stack = [];
var moneyImg;
var vampImg;
var zombImg;
var humanImg;

function preload() {
  moneyImg = loadImage('assets/money.jpg');
  vampImg = loadImage('assets/vampire.jpg');
  zombImg = loadImage('assets/images.jpg');
  humanImg = loadImage('assets/human.jpg');
}

function setup() {
  // put setup code here
  setPlayAgainBtn();
  createCanvas(600,600);
  moveCanvasInsideDiv();
  cols = floor(width / w); // total num of cols
  rows = floor(height / w); // total num of rows
  frameRate(1000);
  createMaze();

  current = grid[0];

  player = new Cell(0, 0);
  for(i = 0; i < player.walls.length; i++) {
    player.walls[i] = false;
  }
  movePlayer();
  
  if (level === 1) {
    enemies = [ createVampireAtRandomCell(), createVampireAtRandomCell(), createVampireAtRandomCell()];
    coins.push(createMoneyBags());
    coins.push(createMoneyBags());
  }
  if (level === 2) {
    enemies = [ createZombieAtRandomCell(), createZombieAtRandomCell(), createZombieAtRandomCell()];
    coins.push(createMoneyBags());
    coins.push(createMoneyBags());
  }
  if (level === 3) {
    enemies = [ createZombieAtRandomCell(), createZombieAtRandomCell(), createZombieAtRandomCell(), createVampireAtRandomCell(), createVampireAtRandomCell(), createVampireAtRandomCell()];
    coins.push(createMoneyBags());
    coins.push(createMoneyBags());
    coins.push(createMoneyBags());
    coins.push(createMoneyBags());
  }
  
  grid[index(cols - 1, rows - 1)].isExit = true;

  var posAns = document.querySelector('.dialog-answer-y');
  posAns.removeEventListener('click', renderPositiveOptions);
  posAns.addEventListener('click', renderPositiveOptions);
  var negAns = document.querySelector('.dialog-answer-n');
  negAns.removeEventListener('click', renderNegativeOptions);
  negAns.addEventListener('click', renderNegativeOptions);

  
}

function draw() {
  // put drawing code here
  background(51);
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  if (level === 4) {
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.final-coins').innerHTML = money;
    return;
  } else {
  
  player.highlight(humanImg);

  coins.forEach(function (cur) {
    if (cur.hasCoin)
      image(moneyImg, cur.cellNum * w, cur.rowNum * w, 50, 50);
  });

  
  enemies.forEach(function(cur, i, arr) {
    if (!cur.killed) {
      if (cur.weakness == "stake")
        image(vampImg, cur.cellNum * w, cur.rowNum * w, 50, 50);
      else if (cur.weakness == "club")
        image(zombImg, cur.cellNum * w, cur.rowNum * w, 50, 50);
    }
  });
  // if (!enemy.hasAnswer)
  //   enemy.draw();
  
  current.visited = true;
  //STEP 1
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    //step 2
    stack.push(current);
    //step 3 remove the wall between cur and n cell
    removeWalls(current, next);
    //Step 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

 function removeWalls(currentCell, neighborCell) {
   var x = currentCell.cellNum - neighborCell.cellNum;
   if (x === 1) {
    currentCell.walls[3]   = false;
    neighborCell.walls[1]  = false;
   } else if (x === -1) {
     currentCell.walls[1]  = false;
     neighborCell.walls[3] = false;
   }

   var y = currentCell.rowNum - neighborCell.rowNum;
   if (y === 1) {
    currentCell.walls[0]   = false;
    neighborCell.walls[2]  = false;
   } else if (y === -1) {
     currentCell.walls[2]  = false;
     neighborCell.walls[0] = false;
   }
 }

 var movePlayer = function() {
  document.removeEventListener("keypress", playerMoveEvent);
  document.addEventListener("keypress", playerMoveEvent);
 }

 function playerMoveEvent(e) {
  switch(e.keyCode) {
    case 119: // W key
      if (player.rowNum - 1 < 0)
        return;
      if (player.currentCell().walls[0])
        return;
      if (player.currentCell().above().hasEnemy) {
        setAttackBtns(player.currentCell().above());
        var enemy;
        enemies.forEach(function (cur) {
        if (cur.cellNum === enemyCell.cellNum && cur.rowNum === enemyCell.rowNum)
          enemy = cur;
        });
        var enemyType = enemy.weakness == 'stake' ? 'vampire' : 'zombie';
        alert(enemyType + " threat, use one of the attacks specified by the buttons under the maze to kill it");
        return;
      }

      player.rowNum = player.rowNum - 1;
      if (player.currentCell().hasCoin) {
        player.currentCell().hasCoin = false;
        addMoneyFromCoin()
      }
      
      break;

    case 115: // S key
      if (player.rowNum + 1 > rows - 1)
        return;
      if (player.currentCell().walls[2])
        return;
      if (player.currentCell().below().hasEnemy) {
        setAttackBtns(player.currentCell().below());
        var enemy;
        enemies.forEach(function (cur) {
        if (cur.cellNum === enemyCell.cellNum && cur.rowNum === enemyCell.rowNum)
          enemy = cur;
        });
        var enemyType = enemy.weakness == 'stake' ? 'vampire' : 'zombie';
        alert(enemyType + " threat, use one of the attacks specified by the buttons under the maze to kill it");
        return;
      }
      
      player.rowNum = player.rowNum + 1;
      if (player.currentCell().hasCoin) {
        player.currentCell().hasCoin = false;
        addMoneyFromCoin()
      }

      if (player.currentCell().isExit) {
        alert("game won, loading level "  + level);
        grid = [];
        stack = [];
        coinTaken = false;
        level++;
        coins.forEach(function(cur) {
          cur.hasCoin = false;
        });
        coins = [];
        document.querySelector('canvas').remove();
        setup();
      }
      break;

    case 97:  // A key
    if (player.cellNum - 1 < 0)
        return;
    if (player.currentCell().walls[3])
      return;

    if (player.currentCell().prev().hasEnemy) {
      setAttackBtns(player.currentCell().prev());
      var enemy;
      enemies.forEach(function (cur) {
      if (cur.cellNum === enemyCell.cellNum && cur.rowNum === enemyCell.rowNum)
        enemy = cur;
      });
      var enemyType = enemy.weakness == 'stake' ? 'vampire' : 'zombie';
      alert(enemyType + " threat, use one of the attacks specified by the buttons under the maze to kill it");
      return;
    }

    player.cellNum = player.cellNum - 1;
    if (player.currentCell().hasCoin) {
      player.currentCell().hasCoin = false;
      addMoneyFromCoin()
    }
    

    break;

    case 100: // D key
    if (player.cellNum + 1 > cols - 1)
        return;
    if (player.currentCell().walls[1])
      return;

    if (player.currentCell().next().hasEnemy) {
      setAttackBtns(player.currentCell().next());
      var enemy;
      enemies.forEach(function (cur) {
      if (cur.cellNum === enemyCell.cellNum && cur.rowNum === enemyCell.rowNum)
        enemy = cur;
      });
      var enemyType = enemy.weakness == 'stake' ? 'vampire' : 'zombie';
      alert(enemyType + " threat, use one of the attacks specified by the buttons under the maze to kill it");
      return;
    }

    player.cellNum = player.cellNum + 1;
    if (player.currentCell().hasCoin) {
      player.currentCell().hasCoin = false;
      addMoneyFromCoin()
    }

    if (player.currentCell().isExit) {
      alert("game won, loading level "  + level)
      grid = [];
      stack = [];
      coinTaken = false;
      level++;
      coins.forEach(function(cur) {
        cur.hasCoin = false;
      });
      coins = [];
      document.querySelector('canvas').remove();
      setup();
    }
   
    break;

  }
 }

 

 function moveCanvasInsideDiv() {
  var canvas = document.querySelector('#defaultCanvas0');
  var parEl = document.querySelector('.parEl');
  parEl.insertAdjacentElement('afterbegin', canvas);
 }

function renderEnemyDialog(question) {
  console.log("renderEnemyDialog called");
  var questionEl = document.querySelector('.dialog-question');
  questionEl.style.display = 'block';
  questionEl.textContent = question;
}

function renderOptions() {
  var positiveC = document.querySelector('.dialog-answer-y');
  positiveC.style.display = 'block';
  positiveC.innerHTML = 'Ok';
  var negativeC = document.querySelector('.dialog-answer-n');
  negativeC.style.display = 'block';
  negativeC.innerHTML = 'No';
}

function hideOptions() {
  document.querySelector('.dialog-answer-y').style.display = 'none';
  document.querySelector('.dialog-answer-n').style.display = 'none';
}

function hideDialog() {
  document.querySelector('.dialog-question').style.display = 'none';
}

function showAnswerBox() {
  console.log("showAnswerBox");
  var answerBox = document.querySelector('.answerBox');
  answerBox.style.display = 'block';
  answerBox.addEventListener('change', function() {
    alert('change');
    console.log(this);
    if (this.value == enemy.answer) {
      handleCorrectAnswer();
      hideDialog();

      addMoney(20)
      this.style.display = 'none';
    }
    else {
      handleIncorrectAnswer();
      hideDialog();

      takeAwayMoney(10);
      this.style.display = 'none';
    }

  });
  answerBox.addEventListener('keypress', function(e) {
    if (e.keyCode === 13) {
      alert("enter");
    }
  });

}

function addMoneyFromCoin() {
  coinTaken = true;
  money = parseInt(document.querySelector('.money').innerHTML);
  money = money + 100;
  document.querySelector('.money').innerHTML = money;
}

function addMoney(val) {
  money = parseInt(document.querySelector('.money').innerHTML);
  money = money + val;
  document.querySelector('.money').innerHTML = money;
}

function takeAwayMoney(val) {
  money = parseInt(document.querySelector('.money').innerHTML);
  money = money - val;
  document.querySelector('.money').innerHTML = money;
}

function renderPositiveOptions() {
  if (level === 1) {
    hideOptions();
    renderEnemyDialog(enemy.secondQuestion());
    showAnswerBox();
    return true;
  } 

  if (level === 2) {
    var curMoney = parseInt(document.querySelector('.money').innerHTML);
    if (curMoney >= 20) {
      hideOptions();
      handleCorrectAnswer();
      takeAwayMoney(20);
      showLevelTwoEnemyAnswer();
    }
    else 
      renderEnemyDialog(enemy.secondQuestion());
  }
    
}

function renderNegativeOptions() {
  hideOptions();

}

function handleCorrectAnswer() {
  player.cellNum = enemy.cellNum;
  player.rowNum = enemy.rowNum;
  player.currentCell().hasEnemy = false;
  enemy.hide();
}

function handleIncorrectAnswer() {
  player.cellNum = player.cellNum + 1;
  player.cellNum = enemy.cellNum;
  player.rowNum = enemy.rowNum;
  player.currentCell().hasEnemy = false;
  enemy.hide();
}

function showLevelTwoEnemyAnswer() {
  console.log("showLevelTwoEnemyAsnwer", enemy.answer);
  document.querySelector('.dialog-question').style.display = 'block'
  
  document.querySelector('.dialog-question').innerHTML = enemy.answer;
}

function setAttackBtns(enemy) {
  console.log("setattackbtns", enemy);
  enemyCell = enemy
  document.querySelector('.action-stab').addEventListener('click', stab);
  document.querySelector('.action-club').addEventListener('click', club);
}

function unbindAttackBtns() {
  document.querySelector('.action-stab').removeEventListener('click', stab);
  document.querySelector('.action-club').removeEventListener('click', club);
}

function stab() {
  alert("stab");
  var enemy;
  enemies.forEach(function (cur) {
    if (cur.cellNum === enemyCell.cellNum && cur.rowNum === enemyCell.rowNum)
      enemy = cur;
  });
  if (enemy.weakness == "stake") {
    alert("Stabbled vampire with a stake");
    alert("Vampire is dead leaving behind 50 coins");
    enemyCell.hasEnemy = false;
    enemy.killed = true;
    addMoney(50);
    unbindAttackBtns();
  }
  else 
    alert("Stab had no effect on zombies");
};

function club() {
  alert("club");
  var enemy;
  enemies.forEach(function (cur) {
    if (cur.cellNum === enemyCell.cellNum && cur.rowNum === enemyCell.rowNum)
      enemy = cur;
  });
  console.log(enemy);
  if (enemy.weakness == "club") {
    alert("Clubbed zombie with a with a club");
    alert("Zombie is dead leaving behind 50 coins");
    enemyCell.hasEnemy = false;
    enemy.killed = true;
    addMoney(50);
    unbindAttackBtns();
  }
  else 
    alert("Club had no effect against vampire");
}

function createVampireAtRandomCell() {
  // set the cell so that it has an enemy
  var randomCell = grid[floor(random(0, grid.length))];
  // if cell already has an enemy, keep getting random cells until we found one that has no enemy
  while (randomCell.hasEnemy) {
    randomCell = grid[floor(random(0, grid.length))];
  }
  randomCell.hasEnemy = true;
  // return a new enemy with stake as the weakness to represent a vampire
  return new Enemy(randomCell.cellNum, randomCell.rowNum, 'stake');
}

function createZombieAtRandomCell() {
  // set the cell so that it has an enemy
  var randomCell = grid[floor(random(0, grid.length))];
  // if cell already has an enemy, keep getting random cells until we found one that has no enemy
  while (randomCell.hasEnemy && randomCell.cellNum === 0 && randomCell.rowNum === 0) {
    randomCell = grid[floor(random(0, grid.length))];
  }
  randomCell.hasEnemy = true;
  // return a new enemy with club as the weakness to represent a zombie
  return new Enemy(randomCell.cellNum, randomCell.rowNum, 'club');
}

function createMoneyBags() {
  var randomCell = grid[floor(random(0, grid.length))];
  // if cell already has an enemy, keep getting random cells until we found one that has no enemy
  while (randomCell.hasCoin && randomCell.cellNum === 0 && randomCell.rowNum === 0) {
    randomCell = grid[floor(random(0, grid.length))];
  }
  randomCell.hasCoin = true;
  return randomCell;
}

function createMaze() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
     var cell = new Cell(j, i);
     grid.push(cell);
    }
  }
}

function setPlayAgainBtn() {
  
  document.querySelector('.reset').removeEventListener('click', reset);
  document.querySelector('.reset').addEventListener('click', reset);
  document.querySelector('.resetP').removeEventListener('click', reset);
  document.querySelector('.resetP').addEventListener('click', reset);
}

function reset() {
  console.log("reset called");
  grid = [];
  stack = [];
  coinTaken = false;
  level = 1;
  coins.forEach(function(cur) {
    cur.hasCoin = false;
  });
  coins = [];
  money = 0;
  document.querySelector('canvas').remove();
  document.querySelector('.money').innerHTML = money.toString();
  document.querySelector('.modal').style.display = 'none';
  setup();
}



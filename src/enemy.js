function Enemy(cellNum, rowNum, weakness) {
    this.cellNum = cellNum;
    this.rowNum = rowNum;
    this.killed = false;
    this.weakness = weakness
    // this.enemy = level;
    // this.hasAnswer = false;
    // this.answer = "";
   
    this.draw = function () {
      var x = this.cellNum * w;
      var y = this.rowNum * w;
     noStroke();
     fill(255, 0 , 0);
     circle(x + 20, y + 20, 15);
    }
 
    this.hide = function () {
     this.killed = true;
    }
    
    
  }
 
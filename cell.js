function Cell(cellNum, rowNum) {
    this.cellNum = cellNum;
    this.rowNum = rowNum;
    // top, right, bottom, left
    this.walls = [true, true, true, true];
    this.visited = false;
    this.hasCoin = false;
    this.hasEnemy = false;
    this.isExit = false;
  
    this.renderCoin = function() {
      //console.log("render coin called");
      //console.log(this);
    //   noStroke();
    //   fill(255, 255, 255);
    //   circle(this.cellNum * w + 20, this.rowNum * w + 20, 15);
    //   this.hasCoin = true;
    }
  
    this.currentCell = function () {
      return grid[index(this.cellNum, this.rowNum)];
    }
  
    this.next = function () {
      return grid[index(this.cellNum + 1, this.rowNum)];
    }
  
    this.prev = function () {
      return grid[index(this.cellNum - 1, this.rowNum)];
    }
  
    this.above = function () {
      return grid[index(this.cellNum, this.rowNum - 1)];
    }
  
    this.below = function () {
      return grid[index(this.cellNum, this.rowNum + 1)];
    }
  
    this.checkNeighbors = function() {
      var neighbors = [];
  
      var top    = grid[index(cellNum, rowNum - 1)];
      var right  = grid[index(cellNum + 1, rowNum)];
      var bottom = grid[index(cellNum, rowNum + 1)];
      var left   = grid[index(cellNum - 1, rowNum)];
  
      if (top    && !top.visited) {
        neighbors.push(top);
      }
  
      if (right  && !right.visited) {
        neighbors.push(right);
      }
      
      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }
      
      if (left   && !left.visited) {
        neighbors.push(left);
      }
  
      if (neighbors.length > 0) {
        var r = floor(random(0, neighbors.length));
        return neighbors[r];
      } else {
        return undefined;
      }
    };
  
    this.highlight = function(img) {
      var x = this.cellNum * w;
      var y = this.rowNum * w;
    //   noStroke();
    //   fill(0, 0, 255, 100);
    //   rect(x, y, w, w);
        image(img, x, y, 50, 50);
    }
  
    this.show = function ()
   {
     var x = this.cellNum * w;
     var y = this.rowNum * w;
     stroke(255);
     if (this.walls[0]) {
      line(x, y, x + w, y);
     }
  
     if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
     }
  
     if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
     }
  
     if (this.walls[3]) {
      line(x, y + w, x, y);
     }
      
     if (this.visited && !this.isExit) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(x, y, w, w);
     } else if (this.isExit) {
      noStroke();
      fill(124,252,0);
      rect(x, y, w, w);
     }
     
   }}

   module.exports = Cell;
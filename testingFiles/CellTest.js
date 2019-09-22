'use strict';

// Import the expect library.  This is what allows us to check our code.
// You can check out the full documentation at http://chaijs.com/api/bdd/
const expect = require('chai').expect;
// Import our ColorIncreaser class.
const Cell = require('../cell');

describe('Cell tests', function() {
  // Will hold the reference to the ColorIncreaser class
  let cell;
  let cell2;
  let cellCoin;
  let cellHasEnemy;

  // beforeEach is a special function that is similar to the setup function in
  // p5.js.  The major difference it that this function runs before each it()
  // test you create instead of running just once before the draw loop
  // beforeEach lets you setup the objects you want to test in an easy fashion.
  beforeEach(function() {
    cell = new Cell(0, 0);
    cell2 = new Cell(5, 5);
    cellCoin = new Cell(0, 0);
    cellHasEnemy = new Cell(0, 0);
  });

  it('should be an object', function(done) {
    expect(cell).to.be.a('object');
    done();
  });

  it('should be initialized with 0 as its x position and 0 as its y position', function(done) {
      expect(cell.cellNum).to.equal(0);
      expect(cell.rowNum).to.equal(0);
      done();
  })

  it('should be initialized with 5 as its x position and 5 as its y position', function(done) {
    expect(cell2.cellNum).to.equal(5);
    expect(cell2.rowNum).to.equal(5);
    done();
  });

  it('should be able to add and remove gold coin', function(done) {
    cellCoin.hasCoin = true;
    expect(cellCoin.hasCoin).to.be.true;
    cellCoin.hasCoin = false;
    expect(cellCoin.hasCoin).to.be.false;
    done();
  });

  it('should be able to add and remove enemy', function(done) {
    cellHasEnemy.hasEnemy = true;
    expect(cellHasEnemy.hasEnemy).to.be.true;
    cellHasEnemy.hasEnemy = false;
    expect(cellHasEnemy.hasEnemy).to.be.false;
    done();
  });



 

});
import "./style.css";
import { fromEvent, interval, merge } from 'rxjs'; 
// import useEffect from react
import React, { useEffect } from 'React';

import { map, filter, scan } from 'rxjs/operators';

type Key = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'Space'
type Event = 'keydown' | 'keyup'




function frogger() {
  /**
   * This is the view for your game to add and update your game elements.
   */
  // declaring all the constants
  const 
    Constants= {
      CanvasSize: 600,
      Islands:4,
      Cars:8,
      RightBoundary:500,
      LeftBoundary:15,
      FrogSize:50,
      FrogSpeed:4,
      FrogStart:250,
      ExpirationTime:100

  }as const

  type ViewType = 'frog' | 'car' | 'island' | 'water' | 'score' | 'gameover' | 'start'
  
  // retrieved from astroids
  class Tick{constructor(public readonly elapsed:number){}}
  class Hop{constructor(public readonly velocity:Vec){}}
  
  const GameClock = interval(10)
        .pipe(map (elapsed=>new Tick(10)))

        const keyObservable$ = <T>(e:Event, k:Key, result:()=>T)=>
        fromEvent<KeyboardEvent>(document,e)
        .pipe(
          filter(({code})=>code === k),
          filter(({repeat})=>!repeat),
          map(result)),
        hopLeft = keyObservable$('keydown','ArrowLeft',()=>new Hop(new Vec(-Constants.FrogSpeed,0))),
        hopRight = keyObservable$('keydown','ArrowRight',()=>new Hop(new Vec(Constants.FrogSpeed,0))),
        stopLeft = keyObservable$('keyup','ArrowLeft',()=>new Hop(new Vec(0,0))),
        stopRight = keyObservable$('keyup','ArrowRight',()=>new Hop(new Vec(0,0)))

  
    // Function taken from Asteroids Example Code
    type Circle = Readonly<{pos:Vec,radius:number}>
    type ObjectId = Readonly<{id:string,createTime:number}>

    // Function taken from Asteroids Example Code
    interface IBody extends Circle,ObjectId{
      viewType: ViewType,
      vel: Vec,
      width: number,
      height: number,
      pos: Vec
      
    }
 
  
  type Body = Readonly<IBody>

  // Function taken from Asteroids Example Code and refactored to fit needs of assn
  // declaring the game state
  type GameState = Readonly<{
    frogo:Body;
    cars:ReadonlyArray<Body>;
    islands:ReadonlyArray<Body>;
    water:ReadonlyArray<Body>;
    score:number;
    gameover:boolean
  }>
  // create froggo
  const createFrogo = ():Body => ({
    id: 'frogo',
    viewType: 'frog',
    vel: new Vec(0,0),
    width: Constants.FrogSize,
    height: Constants.FrogSize,
    pos: new Vec(Constants.FrogStart,Constants.CanvasSize/2)

  } as Body)
  // create cars
  const
    initialstate:GameState = {
      frogo:createFrogo(),
      cars:Array.from({length:Constants.Cars},(_,i)=>({
        id:`car${i}`,
        viewType: 'car',
        vel: new Vec(0,0),
        width: Constants.FrogSize,
        height: Constants.FrogSize,
        pos: new Vec(Constants.FrogStart,Constants.CanvasSize/2)
      } as Body)),
      islands:Array.from({length:Constants.Islands},(_,i)=>({
        id:`island${i}`,
        viewType: 'island',
        vel: new Vec(0,0),
        width: Constants.FrogSize,
        height: Constants.FrogSize,
        pos: new Vec(Constants.FrogStart,Constants.CanvasSize/2)
      } as Body)),
      water:Array.from({length:Constants.Islands},(_,i)=>({
        id:`water${i}`,
        viewType: 'water',
        vel: new Vec(0,0),
        width: Constants.FrogSize,
        height: Constants.FrogSize,
        pos: new Vec(Constants.FrogStart,Constants.CanvasSize/2)
      } as Body)),
      score:0,
      gameover:false

    }
    // function to check border
    
    const checkBorder = ({x:y}:Vec)=>{
      const
      halt = (n:number)=>n < Constants.LeftBoundary || n > Constants.RightBoundary
      return halt(y)
    }
    // function to move froggo
    const moveFrogo = (frogo:Body,hop:Hop):Body => {
      const {vel,pos} = frogo
      const newVel = vel.add(hop.vel)
      const newPos = pos.add(newVel)
      return {...frogo,vel:newVel,pos:newPos}
    }
    // function to check collision
    const checkCollision = (frogo:Body,car:Body):boolean => {
      const {pos,width,height} = frogo
      const {pos:carPos,width:carWidth,height:carHeight} = car
      const
        left = pos.x - width/2,
        right = pos.x + width/2,
        top = pos.y - height/2,
        bottom = pos.y + height/2
      const
        carLeft = carPos.x - carWidth/2,
        carRight = carPos.x + carWidth/2,
        carTop = carPos.y - carHeight/2,
        carBottom = carPos.y + carHeight/2
      return (left < carRight && right > carLeft && top < carBottom && bottom > carTop)
    }
    // function to check if froggo is on water
    const checkWater = (frogo:Body,water:Body):boolean => {
      const {pos,width,height} = frogo
      const {pos:waterPos,width:waterWidth,height:waterHeight} = water
      const
        left = pos.x - width/2,
        right = pos.x + width/2,
        top = pos.y - height/2,
        bottom = pos.y + height/2
      const

        waterLeft = waterPos.x - waterWidth/2,
        waterRight = waterPos.x + waterWidth/2,
        waterTop = waterPos.y - waterHeight/2,
        waterBottom = waterPos.y + waterHeight/2
      return (left < waterRight && right > waterLeft && top < waterBottom && bottom > waterTop)
    }
    // function to check if froggo is on island
    const checkIsland = (frogo:Body,island:Body):boolean => {
      const {pos,width,height} = frogo
      const {pos:islandPos,width:islandWidth,height:islandHeight} = island
      const
        left = pos.x - width/2,
        right = pos.x + width/2,
        top = pos.y - height/2,
        bottom = pos.y + height/2
      const
        islandLeft = islandPos.x - islandWidth/2,
        islandRight = islandPos.x + islandWidth/2,
        islandTop = islandPos.y - islandHeight/2,
        islandBottom = islandPos.y + islandHeight/2
      return (left < islandRight && right > islandLeft && top < islandBottom && bottom > islandTop)
    }
    // handle collisions
    const handleCollision = (frogo:Body,car:Body):Body => {
      const {vel,pos} = frogo
      const {vel:carVel,pos:carPos} = car
      const newVel = vel.add(carVel)
      const newPos = pos.add(carPos)
      return {...frogo,vel:newVel,pos:newPos}
    }

    // update svg scene
    
      
    const tick = (state:GameState, elapsed:number) => {
      
    }



    }


  const svg = document.querySelector("#svgCanvas") as SVGElement & HTMLElement;
  
  

}

// create a function that will move square on key press

function main() {
  /**
   * This is the view for your game to add and update your game elements.
   */
  frogger();
  

}



// Utility taken from Asteroids Example Code
   // Function taken from Asteroids Example Code
   class Vec {
    constructor(public readonly x: number = 0, public readonly y: number = 0) {}
    add = (b:Vec) => new Vec(this.x + b.x, this.y + b.y)
    sub = (b:Vec) => this.add(b.scale(-1))
    len = ()=> Math.sqrt(this.x*this.x + this.y*this.y)
    scale = (s:number) => new Vec(this.x*s,this.y*s)
    ortho = ()=> new Vec(this.y,-this.x)
    rotate = (deg:number) =>
              (rad =>(
                  (cos,sin,{x,y})=>new Vec(x*cos - y*sin, x*sin + y*cos)
                )(Math.cos(rad), Math.sin(rad), this)
              )(Math.PI * deg / 180)
  
    static unitVecInDirection = (deg: number) => new Vec(0,-1).rotate(deg)
    static Zero = new Vec();
  }
  // Function taken from Asteroids Example Code
  function showKeys() {
    function showKey(k:Key) {
      const arrowKey = document.getElementById(k)!,
        o = (e:Event) => fromEvent<KeyboardEvent>(document,e).pipe(
          filter(({code})=>code === k))
      o('keydown').subscribe(e => arrowKey.classList.add("highlight"))
      o('keyup').subscribe(_=>arrowKey.classList.remove("highlight"))
    }
    showKey('ArrowLeft');
    showKey('ArrowRight');
    showKey('Space');
  }
setTimeout(showKeys, 0)

// Function taken from Asteroids Example Code
const 
not = <T>(f:(x:T)=>boolean)=> (x:T)=> !f(x)

// Function taken from Asteroids Example Code
function flatMap<T,U>(
a:ReadonlyArray<T>,
f:(a:T)=>ReadonlyArray<U>
): ReadonlyArray<U> {
return Array.prototype.concat(...a.map(f));
}

// Function taken from Asteroids Example Code
const
elem = 
<T>(eq: (_:T)=>(_:T)=>boolean)=> 
(a:ReadonlyArray<T>)=> 
  (e:T)=> a.findIndex(eq(e)) >= 0

// Function taken from Asteroids Example Code
const
except = 
<T>(eq: (_:T)=>(_:T)=>boolean)=>
(a:ReadonlyArray<T>)=> 
  (b:ReadonlyArray<T>)=> a.filter(not(elem(eq)(b)))


// Function taken from Asteroids Example Code
function isNotNullOrUndefined<T extends Object>(input: null | undefined | T): input is T {
return input != null;
}

// The following simply runs your main function on window load.  Make sure to leave it in place.
if (typeof window !== "undefined") {
  window.onload = () => {
    main();
  };
}

// temporary placement
// const Long_rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//    Long_rectangle.setAttribute("width", "600");
//    Long_rectangle.setAttribute("height", "150");
//    // set the color of the square to green
//    Long_rectangle.setAttribute("fill", "red");
//    Long_rectangle.setAttribute("x", "0");
//    Long_rectangle.setAttribute("y", "500");
//    svg.appendChild(Long_rectangle);
  

//    const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//    square.setAttribute("width", "50");``
//    square.setAttribute("height", "50");
//    // set the color of the square to green
//    square.setAttribute("fill", "green");
 
//    // place the square at the bottom of the svg
//    square.setAttribute("x", "250");
//    square.setAttribute("y", "550");
 
//    // Example on adding an element
//    svg.appendChild(square);

//initial variables

let tamagochiState = 2
let happyCount = 20

const tamagochi = []

let shopOut = false

let timerStart = false
let timerCount = 10000
let timer = 0

let coins = 0

function mMax(num1, num2) { // function to return max number if over a number
  if (num1 > num2) return num2
  else return num1
}

let buttons = [ // list of all buttons
  {title: "reset", l: 540, t: 30, w: 120, h: 50, callback: () => timerCount = 0},
  {title: "start", l: 480, t: 300, w: 100, h: 50, callback: () => timerStart = true},
  {title: "stop", l: 620, t: 300, w: 100, h: 50, callback: () => timerStart = false},
  {title: "+ 5", l: 480, t: 400, w: 100, h: 50, callback: () => timerCount += 300000},
  {title: "+ 10", l: 620, t: 400, w: 100, h: 50, callback: () => timerCount += 600000},
  {title: "+ 15", l: 480, t: 470, w: 100, h: 50, callback: () => timerCount += 900000},
  {title: "+ 20", l: 620, t: 470, w: 100, h: 50, callback: () => timerCount += 1200000},
  {title: "", l: 335, t: 535, w: 60, h: 60, callback: () => {
    shopOut = !shopOut
    for (let i = 8; i < buttons.length; i++)
      buttons[i].hidden = !buttons[i].hidden
    
  }},
  {hidden: true, title: "", l: 30, t: 390, w: 60, h: 60, callback: () => {if (coins >= 1) {happyCount+=10; coins-=1}}},
  {hidden: true, title: "", l: 100, t: 390, w: 60, h: 60, callback: () => {if (coins >= 10) {happyCount+=150; coins-=10}}},
  {hidden: true, title: "", l: 170, t: 390, w: 60, h: 60, callback: () => {if (coins >= 2) {happyCount+=20; coins-=2}}},
  {hidden: true, title: "", l: 240, t: 390, w: 60, h: 60, callback: () => {if (coins >= 1) {happyCount+=10; coins-=1}}},

]

function setup() {
  createCanvas(800, 600)
  textAlign(LEFT)

  // load all data(user data / images)

  if (getItem("T_Time")) timerCount = getItem("T_Time")
  if (getItem("T_Timer")) timer = getItem("T_Timer")
  if (getItem("T_Coins")) coins = getItem("T_Coins")
  if (getItem("T_Happy")) happyCount = getItem("T_Happy")

  buttons[7].title = loadImage("images/shopIcon.jpeg")
  buttons[8].title = loadImage("images/balloons.jpeg")
  buttons[9].title = loadImage("images/mic.jpeg")
  buttons[10].title = loadImage("images/confetti.png")
  buttons[11].title = loadImage("images/pizza.jpeg")
  tamagochi[0] = loadImage("images/freddyHappy.png")
  tamagochi[1] = loadImage("images/freddyMid.gif")
  tamagochi[2] = loadImage("images/freddySad.png")
}

function drawBtn(content, x, y, w, h) { // function to draw buttons
  fill(255)
  rect(x, y, w, h)
  fill(0)
  textSize(35)
  if (typeof(content) == "string") 
    text(content, x-content.length*4+30, y+h/2+10)
  else
    image(content, x, y, w, h)
}


function draw() {

  // handle timer
  if (timerStart && timerCount > 0) {
    timerCount -= deltaTime
    timer += deltaTime

  } else {
    timerStart = false
    timer = 0
    
    happyCount -= deltaTime/1000
    if (happyCount < 0) happyCount = 0
    
  }

  //store items
  storeItem("T_Time", timerCount)
  storeItem("T_Timer", timer)
  storeItem("T_Happy", happyCount)
  storeItem("T_Coins", coins)

  //handle tamagotchi
  if (happyCount >= 0) tamagochiState = 2
  if (happyCount >= 50) tamagochiState = 1
  if (happyCount >= 100) tamagochiState = 0

  if (timer >= 60000) {
    coins++
    timer = 0
  }

  //format time string
  let secs = `${floor(timerCount/1000 % 60)}`
  let mins = `${floor(timerCount/60000)}`
  if (secs.length == 1) secs = secs.padStart(2, "0");
  if (mins.length == 1) mins = mins.padStart(2, "0");
  let timerTxt = `${mins}:${secs}`


  //draw tamagotchi
  background(200)

  fill(255)
  rect(0, 0, 800, 600)
  line(400, 0, 400, 600)

  rect(530, 200, 150, 50)
  fill(0)
  textSize(45)
  text(timerTxt, 550, 240)


  fill(255)
  circle(20, 20, 30)
  fill(0)
  textSize(20)
  text("$", 15, 27)

  text(coins.toString().padStart(4, "0"), 60, 27)


  fill(255)
  circle(560, 120, 30)
  fill(0)
  textSize(20)
  text("$", 555, 127)

  text(coins.toString().padStart(4, "0"), 600, 127)

  
  text(`Happiness: ${floor(happyCount)}`, 150, 70)
  fill(255)
  rect(50, 80, 300, 10)
  fill(0, 255, 0)
  rect(50, 80, mMax(happyCount/100*300, 300), 10)

  image(tamagochi[tamagochiState], 20, 100, 360, 360)


  if (shopOut) {
    fill(255)
    rect(20, 380, 300, 200)

    fill(0)
    text("$1", 40, 480)
    fill(0)
    text("$10", 105, 480)
    fill(0)
    text("$2", 180, 480)
    fill(0)
    text("$1", 250, 480)
  }

  
  for (let i = 0; i < buttons.length; i++) if (!buttons[i].hidden) drawBtn(buttons[i].title, buttons[i].l, buttons[i].t, buttons[i].w, buttons[i].h)
}

function mouseClicked() {
  if (mouseButton == "left") { //handle buttons
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i]
      if (!btn.hidden) if (mouseX >= btn.l && mouseX <= btn.l+btn.w && mouseY >= btn.t && mouseY <= btn.t+btn.h) btn.callback()
    }
  }
}
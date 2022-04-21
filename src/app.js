const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')

const laserShotSound = document.querySelector(`audio[data-sound="laserShot"]`);
const alienKillSound = document.querySelector(`audio[data-sound="alienKill"]`)
const shipDestroySound = document.querySelector(`audio[data-sound="shipDestroy"]`)


let currentShooterIndex = 217
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0
let isGameOn = true
let isTimeForMissle = true

for (let i = 0; i < 225; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

function draw() {
  for (let i = 20; i < 30; i++) {
    if(!aliensRemoved.includes(i) && squares[alienInvaders[i]]) {
      squares[alienInvaders[i]].classList.add('invader','invader-3')
    }
  }

  for (let i = 10; i < 20; i++) {
    if(!aliensRemoved.includes(i) && squares[alienInvaders[i]]) {
      squares[alienInvaders[i]].classList.add('invader','invader-2')
    }
  }

  for (let i = 0; i < 10; i++) {
    if(!aliensRemoved.includes(i) && squares[alienInvaders[i]]) {
      squares[alienInvaders[i]].classList.add('invader','invader-1')
    }
  }
}

draw()

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
      if(squares[alienInvaders[i]].classList.contains('invader')) {
          squares[alienInvaders[i]].classList.remove('invader','invader-1','invader-2','invader-3')
      }
  }
}

squares[currentShooterIndex].classList.add('shooter')


function moveShooter(e) {
  if(isGameOn) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
      case 'ArrowLeft':
        if (currentShooterIndex % width !== 0) currentShooterIndex -=1
        break
        case 'ArrowRight' :
          if (currentShooterIndex % width < width -1) currentShooterIndex +=1
          break
        }
        squares[currentShooterIndex].classList.add('shooter')
  }
}

document.addEventListener('keydown', moveShooter)

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
  remove()

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1
      direction = -1
      goingRight = false
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  draw()

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    gameOver(false)
}

  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[i] >= (squares.length)) {
        gameOver(false)
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    gameOver(true)
  }
}

function gameOver(isWin) {
    if(isWin) {
        resultsDisplay.innerHTML = 'YOU WIN'
        clearInterval(invadersId)
        isGameOn = false
    } else {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)

        shipDestroySound.currentTime = 0;
        shipDestroySound.play()

        isGameOn = false
        squares[currentShooterIndex].classList.remove('shooter')
        squares[currentShooterIndex].classList.add('shipBoom')
    }
}


invadersId = setInterval(moveInvaders, 50)

function shoot(e) {
  let laserId
  


  let currentLaserIndex = currentShooterIndex
  function moveLaser() {
        if(squares[currentLaserIndex]) {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width

            if(squares[currentLaserIndex] === undefined) {
                clearInterval(laserId)
                return
            } else {
                squares[currentLaserIndex].classList.add('laser')
            }
            // squares[currentLaserIndex].classList.add('laser')


            if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader','invader-1','invader-2','invader-3')
            squares[currentLaserIndex].classList.add('boom')

            alienKillSound.currentTime = 0;
            alienKillSound.play()
        
            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 150)
            clearInterval(laserId)
        
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
        }    
    } 


  }
    if(isGameOn && isTimeForMissle) {
        switch(e.key) {
            case ' ':
                laserId = setInterval(moveLaser, 100)
                
                laserShotSound.currentTime = 0;
                laserShotSound.play()

                isTimeForMissle = false
                setTimeout(() => {
                  isTimeForMissle = true
                }, 700);
      }
    }

}

document.addEventListener('keydown', shoot)
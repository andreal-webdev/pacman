const canvas = document.getElementById("canvas")

/*I decided to use "c" for context because is shorter and I'm going to use it several times*/
const c = canvas.getContext("2d");
/*This will give the canvas a width and a height. I wanted to use the entire space of the screen so I used innerWidth and innerHeight */
canvas.width = window.innerWidth
canvas.height = window.innerHeight

/*This is how I'm going to start constructing my map or boundaries*/
class wall {
    static width = 40
    static height = 40
    /*This is a method that will assign properties to specific object*/
    constructor({position}){ /* the curly brackets inside the brackets are better to use so I don't have to remember the exact order of this values*/
        /*The position will be a variable position, but the height and width will be static*/
        this.position = position 
        this.width = 40
        this.height = 40           
        
    }
    /*This will draw the square or edges of my boundary*/
    draw(){
        c.fillStyle = '#ff0090'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) //when drawing a rectangles you need all of this values(possition on the x, position on the y, width and height)
    }
}

/*This is pacman (main character)*/
class Pacman {
    constructor({position, velocity}) {   /*This is a method that will assign properties to specific object*/ //Here I'm constructing the pacman with all its different properties
        this.position = position
        this.velocity = velocity
        this.radius = 18 //how big my pacman is
        this.radians = 0.75 //this will create the pacman mouth with the open rate and the c.lineTo. In htlm radians is used instead of degrees. 
        this.openRate = 0.12 // this is for the pacman mouth opening
        this.rotation = 0 //the pacman will start looking to the right
    }
    //this will draw the circle for pacman
    draw(){
        c.save() //this will start the animation (or code) without affecting the entire canvas. This will make the pacman rotate acording to the direction it is moving
        c.translate(this.position.x, this.position.y) //this is centering the rotation in the center of the pacman instead of the corner of the canvas
        c.rotate(this.rotation)//this is to make the pacman rotate according to where it moves
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians) //(x,y,radius, start angle, end angle (=Math.PI)) //Math.PI = 180 degrees *2 = a full circle
        c.lineTo(this.position.x, this.position.y) //this will draw a line in the pacman that will help create the mouth of pacman
        c.fillStyle = '#00b7eb'
        c.fill()
        c.closePath()
        c.restore() // this will make the animation above of the rotation of pacman stop here. Without affecting the rest of the canvas, only the pacman
    }
    //  this is setting up the consition for the pacman to open and close its mouth depending on the 
    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
        //this will make the mouth of the pacman open and close whenever the openening is between 0 and 0.75 radians.
        if (this.radians < 0 || this.radians > .75) this.openRate = - this.openRate

        this.radians += this.openRate
    }
}
 //this are the pellets, their position, size and color
class Pellet {
    constructor({position}) {
        this.position = position        
        this.radius = 5
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#ffc40c'
        c.fill()
        c.closePath()
    }    
}
//This is the sign that is going to appear when the pacman eats all the pelletes. Here I'm just drawing it, but it won't appear until later in the I tell it to
class Sign {
  
    draw(){
               
        c.fillStyle = "#bfc1c2";
        c.fillRect(canvas.width/3.4, canvas.height/3, 500,200 )
        c.font= "50px impact";
        c.fillStyle = "black";
        c.textAlign = "center";
        c.fillText("Thanks for playing!", canvas.width/2.2, canvas.height/2);       

    }
}

//here I'm initiating all my objects: pacman, pellets, sign, map, keys. Pellts and boundaries will be arrays.

const sign = new Sign()
const pellets = []
const boundaries = []
const pacman = new Pacman({
    position: {  //position where the pacman will start in the canvas. I was going to put it in the left corner, but I changed my mind and I put it almost in the middle.
        x: wall.width * 16.5, 
        y: wall.height * 7.5
    },
    velocity: {
        x:0,
        y:0
    }
})
//this is going to be used to set up the key when pressed, or unpressed and what last key was pressed
const keys = {
    ArrowUp:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowDown:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    }
}
let lastKey = ''


//This is the map or the boundaries where pacman is goin to move. The '.' are the pellets that pacman will eat. And the '-' are squares/boundaries/obstacles where pacman is going to collide and won't be able to move.

const map = [
    ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-','-','-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-','-','-', '-', '-','-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-','.', '-', '-', '-','.', '-','.', '-','.', '-','.', '-', '-', '-', '-','.', '-','.', '-','.', '-','.', '-', '-', '-', '-','.', '-','.', '-', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-','.', '-','.', '-','.', '-', '-', '-','.', '-','.', '-','.', '-','.', '-','.', '-', '-', '-','.', '-','.', '-','.', '-','.', '-', '-','.', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-', '-','.', '-','.', '-','.', '-', '-','.', '-', '-', '-', '-', '-','.', '-','.', '-','.', '-','.', '-','.', '-', '-', '-','.', '-','.', '-', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-', '-','.', '-','.', '-', '-','.', '-', '-','.', '-','.', '-','.', '-', '-', '-', '-','.', '-','.', '-','.', '-','.', '-','.', '-', '-','.', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-', '-','.', '-','.', '-', '-','.', '-', '-','.', '-','.', '-','.', '-', '-', '-', '-','.', '-','.', '-','.', '-','.', '-','.', '-', '-','.', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-','.', '-','.', '-','.', '-', '-', '-','.', '-','.', '-','.', '-','.', '-','.', '-', '-', '-','.', '-','.', '-','.', '-','.', '-', '-','.', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-','.', '-', '-', '-','.', '-','.', '-','.', '-','.', '-', '-', '-', '-','.', '-','.', '-','.', '-','.', '-', '-', '-', '-','.', '-','.', '-', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-','-','-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-','-','-', '-', '-','-',],
]

//this is a loop that saying that add a square(wall) in the map(array) for each  '-', and add a pellet when you see '.'. The position will along the width and height of the wall

map.forEach((row, i) => {
    row.forEach((column, j) =>{
        switch (column) { 
            case'-':    // this is saying to switch the dash symbol '-' to a wall (square)
                boundaries.push(
                    new wall({
                        position:{ //this use of i and j is so then if I decide to add or delete a row, this will still work because it's saying to go through all the rows that are in the array 
                            x: wall.width *j,
                            y: wall.height * i
                        },
                    })
                )
                break // it's stopping the looping
            case'.':
                pellets.push( //here is the same. it is saying replace the '.' with a pellet along the x and the y inside the boundary. 
                    new Pellet({
                      position: {
                            x: j * wall.width + wall.width / 2, //this are divided by 2 so the pellets are position in the center of the row on the x
                            y: i * wall.height + wall.height / 2 //this are divided by 2 so the pellets are position in the center of the row on the y
                        }  
                    })
                )
        }       
    })
})
//colition detection. Player and square are my two objects. 
function playerCollidesSquare({player, square}) {
    //This is to position pacman in the center of the boundaries. This is useful for collision detection
    return (
        player.position.y - player.radius + player.velocity.y <= //this detects the top of the pacman
         square.position.y + square.height && 
        player.position.x + player.radius + player.velocity.x >= //this detects the right of the pacman
         square.position.x && 
        player.position.y + player.radius + player.velocity.y >= //this detects the bottom of the pacman
         square.position.y && 
        player.position.x - player.radius + player.velocity.x <= //this detects the left of the pacman
         square.position.x + square.width
    )
}
//Pacman movement and keys. Here you will see the set up of the keys when pressing down or up and pacman velocity
/* Basically what all this code bellow is saying is: if an specific key (ArrowUp/ArrowDown/ArrowLeft/ArrowRight) is being pressed 
and that same key is the last key being pressed well then the movement is true, do that movement. 
*/
function animate() {
    window.requestAnimationFrame(animate) //start of the animation
    c.clearRect(0, 0, canvas.width, canvas.height) //this cleans our canva, so the pacman does not leave a trail  while moving

    if (keys.ArrowUp.pressed && lastKey === 'ArrowUp'){  //Up movement // when the ArrowUp key is pressed and the last key is ArrowUp 
        for (let i = 0; i < boundaries.length; i++){ //this is saying keep looping as long this consition is true
            const Wall = boundaries [i]
            if(
                playerCollidesSquare({
                    player: {
                        ...pacman,
                        velocity: { //velocity: 0= no movement. Any number above 0 is movement, being 1 very slow and faster everytime you increase the number
                            x: 0, //no movement because in this case the player should only be moving on the y and not in the x. 
                            y: -4 // The negative number is because is moving up
                        }
                    },
                    square: Wall
                })
            )   {
                pacman.velocity.y = 0 //no movement becasue pacman is hitting a wall
                break  //this is a break of the loop so the loop can start again depending on the key being pressed
            }   else {
                pacman.velocity.y = -4  //if none of the other conditions applies them pacman should be able to move up on the y
            }
        }/*All the code bellow has same explanation as the one above.
        Movements up and down are in the Y. Up= negative number Down = positive number
        Movements left and right are in the X. Left= negative number Right= positive number
        */
    }   else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft'){ //moving left // when the ArrowLeft key is pressed and the last key is ArrowLeft
        for (let i = 0; i < boundaries.length; i++){
            const Wall = boundaries [i]
            if(
                playerCollidesSquare({
                    player: {
                        ...pacman,
                        velocity: {
                            x: -4, //negative number because it's moving to the left. Left movement happens in the X
                            y: 0
                        }
                    },
                square: Wall
                })

            )   {
                pacman.velocity.x = 0
                break
            }   else {
                pacman.velocity.x = -4
            }
        }
    }   else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown'){ //down movement // when the ArrowDown key is pressed and the last key is ArrowDown
        for (let i = 0; i < boundaries.length; i++){
            const Wall = boundaries [i]
            if(
                playerCollidesSquare({
                    player: {
                        ...pacman,
                        velocity: {
                            x: 0,
                            y: 4 //positive number because it's moving to the down. Down movement happens in the Y
                        }
                    },
                    square: Wall
                })
            )   {
                pacman.velocity.y = 0
                break
            }   else {
                pacman.velocity.y = 4
            }
        }
    }   else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight'){ // right movement // when the ArrowRight key is pressed and the last key is ArrowRight
        for (let i = 0; i < boundaries.length; i++){
            const Wall = boundaries [i]
            if(
                playerCollidesSquare({
                    player: {
                        ...pacman,
                        velocity: {
                            x: 4, //positive number because it's moving to the right. Down movement happens in the X
                            y: 0
                        }
                    },
                    square: Wall
                })

            )   {
                pacman.velocity.x = 0
                break
            }   else {
                pacman.velocity.x = 4
            }
        }
    }

    pellets.forEach((pellet, i) => {
        pellet.draw()

        if (Math.hypot(
                pellet.position.x - pacman.position.x,
                pellet.position.y - pacman.position.y
            ) < 
            pellet.radius + pacman.radius
        ) {
            console.log('touch')
            pellets.splice(i, 1)
        }
    })
    

    boundaries.forEach((wall)=> { //this is drawing the wall (squares)
        wall.draw()
        //This is for collition detection
        if (
            playerCollidesSquare({
                player: pacman,
                square: wall
            })
        )   {  //velocity is 0 when pacman hits the wall. 0 = no movement         
            pacman.velocity.x = 0 
            pacman.velocity.y = 0
        }
    })
    pacman.update()
    //pacman.velocity.x = 0
    //pacman.velocity.y = 0

    //Pacman Rotation acording to the direction it moves
    if (pacman.velocity.x > 0) pacman.rotation = 0 //this is the default rotation. Pacman will be moving right
    else if (pacman.velocity.x < 0) pacman.rotation = Math.PI  // this will make change the rotation of pacman when moving left
    else if (pacman.velocity.y > 0) pacman.rotation = Math.PI / 2 // this will make change the rotation of pacman when moving up
    else if (pacman.velocity.y < 0) pacman.rotation = Math.PI * 1.5 // this will make change the rotation of pacman when moving down

    //Thanks message. This is saying display the sign object when the pellets are equal to 0. If you don't want to play the entire game to be able to see this function. Just change the === to > and you will see ir right away

    if (pellets.length === 0){ 

        sign.draw()     
        //here I can stop the animations of the pacman too, but I don't want to . I want the pacman to be able to continue moving.    
    }
}


animate() 
// this is setting up the key to make pacman move when pressing down the keys
window.addEventListener('keydown', (event) => {
    event.preventDefault(); // prevent the default behavior of arrow key presses
    console.log(event.key); //I used this to find out the name of the arrows
    switch (event.key) { //lastKey is necessary when two keys are pressed at the same time, so the pacman moves depending on which was the last key being pressed. This way the pacman will keep moving instead of stopping.
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            lastKey = 'ArrowUp';
            break; //the break is to stop
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            lastKey = 'ArrowLeft';
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = true;
            lastKey = 'ArrowDown';
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            lastKey = 'ArrowRight';
            break;

    }
});

// this is setting up the key to make pacman stop when pressing up the key
window.addEventListener('keyup', (event) => {
    event.preventDefault(); // prevent the default behavior of arrow key releases
    switch (event.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

    }
});
 



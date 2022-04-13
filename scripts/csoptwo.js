// sizing params start
let boxwidth = 0;
let normal = [0, 0];
let landscape = true;
let difference = 0;
let containerbox = 0;
let courseHeight = 0;
let lineHeight = 0;
// sizing params end

// pick player params
let ORION = false;
let rollWheel = true;
let defaultO = false; // ORION type of "O"
let clickable = true;
// pick player params end

// gameCounter
let turns = 0;
// gameCounter End

$(document).ready(function() {
    console.log('ready');
    $(".endbg").hide();
    initSize();
    $(".participant").css("font-size", courseOption+"px");
    setInterval(function(){
        initSize();
    }, 500);

    $(document).on('click', ".dot", function() {
        if (rollWheel) {
            initGame();
            rollWheel = false;
            // for pc
            $(".dot").removeClass("cursor");
            $(".box").addClass("cursor");
        }
    }).on('click', ".box", function(){
        if (!clickable) {
            return
        }
        console.log(turns)
        if ($(this).hasClass("clicked")) {
            console.log("cancelled")
            return false;
        }
        turns += 1;
        console.log("clicked")
        $(this).addClass("clicked")
        if (ORION) {
            // orion's turn
            ORION = false;
            if (defaultO) {
                $(this).addClass("clickedone");
                winCheck();
                return turnAward();
            } else {
                $(this).addClass("clickedtwo");
                winCheck();
                return turnAward();
            }
            
        } else {
            ORION = true;
            $(this).addClass("clickedthree");
            $(".clickedthree, .participant").css("font-size", courseOption+"px");
            winCheck();
            return turnAward();
        }
    }).on ("click", ".btn.restart",function() {
        location.reload();
    })
})

// Display & Structural Settings 
function initSize() {
    if (detectSize()){   //checks if screenSize has changed
        callibrateSize();
        setSize();
        console.log("resized")
    }; 
}

function detectSize() {
    if (normal[0] != window.innerWidth) {
        return true; // need to be changed
    }
    if (normal[1] != window.innerHeight) {
        return true; // need to be changed
    }
    return false; // no need to be changed
}

function callibrateSize() {
    normal = [window.innerWidth, window.innerHeight];
    difference = normal[0] - normal[1];
    boxwidth = window.innerHeight;
    if (difference < 0) {
        boxwidth = window.innerWidth
        landscape = false;
        return $(".bg").addClass("wrap");
        
    }
    $(".bg").removeClass("wrap");
    landscape = true;
    // Height > Width (Use smaller) (Portrait view)
}

function setSize() {
    containerbox = boxwidth * 0.90
    courseHeight = boxwidth * 0.285
    courseOption = boxwidth * 0.2
    lineHeight = boxwidth * 0.05

    $(".container, .line-container, .logo, .randomiser").width(containerbox).height(containerbox);
    $(".bg").width(window.innerWidth).height(window.innerHeight);
    $(".box").width(courseHeight).height(courseHeight);
    $(".btn, .dot").css("font-size", (lineHeight * 0.5)+"px");
    $(".winnertext").css("font-size", (lineHeight * 1.3)+"px");
    $(".btn").width(courseOption * 1.2).height(courseOption * 0.7);
    $(".line").height(containerbox * 0.97).width(containerbox * 0.05);

}
// Display & Structural Settings End

//Game

function turnAward () {
    if (ORION) {
        $(".overlay").removeClass("player").addClass("orion");
        // run ORION's turn
    } else {
        $(".overlay").removeClass("orion").addClass("player");
    }
}
//Game Ending

// pick first player

function initGame() {
    rotateWheel(pickPlayer());
    setTimeout(function(){
        $(".randomiser").addClass("fadeOut");
        $(".hash.hide").removeClass("hide").addClass("fadeIn");
        setTimeout(function(){
            turnAward();
        }, 250)
        setTimeout(function(){
            $(".randomiser").hide()
        }, 1000);
    }, 3500);
    if (randomiser(2)) {
        defaultO = true;
        // ORION type of "O"
    }
}

function pickPlayer () {
    const max = 5;
    const revolutions = 6 * 360;
    let choice = randomiser(max);
    if (choice%2 == 0) {
        ORION = false;
    } else {
        ORION = true;
    }
    // player chosen
    console.log(choice)

    let value = randomiser(180)

    console.log(value)

    let angleSpin = value + revolutions - 320;

    console.log(angleSpin, ORION)
    return angleSpin
}

function rotateWheel (angle) {
    const toRotate = $(".wheel");

    $({deg: 0}).animate({deg: angle}, {
        duration: 3000,
        step: function (now) {
            toRotate.css({
                transform: "rotate(" + now + "deg)"
            })
        }
    });
}
    // if <=89 : ORION = true
    // if >=271 : ORION = true
    // if 90 : + 1 -> YOU, ORION = false
    // if 270 : - 1 -> YOU, ORION = false
    // if >=91 : YOU, ORION = false

function randomiser(maxInclusive) {
    return Math.floor(Math.random() * maxInclusive)
}
// pick first player end

// handle wins

// configurations:

function winCheck() {
    let groups = [
        $(".d1.clicked:not(.clickedthree)").length,
        $(".d1.clicked.clickedthree").length,
        $(".d2.clicked:not(.clickedthree)").length,
        $(".d2.clicked.clickedthree").length,
        $(".r1.clicked:not(.clickedthree)").length,
        $(".r1.clicked.clickedthree").length,
        $(".r2.clicked:not(.clickedthree)").length,
        $(".r2.clicked.clickedthree").length,
        $(".r3.clicked:not(.clickedthree)").length,
        $(".r3.clicked.clickedthree").length,
        $(".c1.clicked:not(.clickedthree)").length,
        $(".c1.clicked.clickedthree").length,
        $(".c2.clicked:not(.clickedthree)").length,
        $(".c2.clicked.clickedthree").length,
        $(".c3.clicked:not(.clickedthree)").length,
        $(".c3.clicked.clickedthree").length
    ]
    let playerType = true;
    let winCode = 0;
    let endText = "YOU WIN!"

    for (let i = 0; i < groups.length; i++) {
        if (groups[i] === 3) {
            // won
            clickable = false;
            if (i%2 == 0) {
                // ORION Wins
                playerType = false;
                winCode = (i)/2 + 1
                endText = "Good Try!"
            } else {
                // Player Wins, Default settings
                winCode = (i+1)/2
            }
            console.log(i, winCode)
            endGame(winCode)
            setTimeout(function() {
                endMenu(endText);
            }, 1000);
            break;
        }
    }
    if (turns == 9 && winCode == 0) {
        //draw
        clickable = false;
        endText = "It was a good fight :)"
        setTimeout(function() {
            endMenu(endText);
        }, 1000);
    }
}

function endGame(winCode) {
    let winType = "win" + winCode;
    console.log(winType);
    $(".play-container", ".line-container").show();
    $(".line-container").addClass(winType).addClass("finish")
}

function endMenu(endtext) {
    $(".winnertext").html(endtext);
    $(".endbg, endMenu").show().addClass("fadeIn");
}


// bg orion/you selection, green -> you, orion -> purple
// flicker glitch of end menu
// line behind item
// add disable clickers

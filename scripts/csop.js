let boxwidth;
let normal = [0, 0];
let landscape = true;
let timerSet = 500;
let difference = 0;
let containerbox = 0;
let courseHeight = 0;
let courseOption = 0;

$(document).ready(function() {
    console.log("ready")
    setInterval(function(){
        initSize();
    }, 500);
})

function initSize() {
    if (detectSize()){   //checks if screenSize has changed
        callibrateSize();
        setSize();
        options();
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
        boxwidth = window.innerWidth * 0.8
        landscape = false;
        return $(".bg, .course-container").addClass("wrap");
        
    }
    $(".bg, .course-container").removeClass("wrap");
    landscape = true;
    // Height > Width (Use smaller) (Portrait view)
}

function setSize() {
    containerbox = boxwidth * 1.1
    courseHeight = boxwidth * 0.35
    courseOption = boxwidth * 0.23
    if (landscape) {
        containerbox = boxwidth * 0.90
        courseHeight = boxwidth * 0.3
        courseOption = boxwidth * 0.2
    }
    $(".container").width(containerbox).height(containerbox);
    if (landscape) {
        $(".course-container").width(courseHeight).height(containerbox).addClass("wrap");
        $(".courses").width(courseOption).height(courseOption);
    } else {
        $(".course-container").width(containerbox).height(courseHeight).removeClass("wrap");
        $(".courses").width(courseOption).height(courseOption);
    }
}

function options() {
    if (landscape) {
        return $(".menu").removeClass("portrait").addClass("landscape");
    }
    $(".menu").removeClass("landscape").addClass("portrait");
}   
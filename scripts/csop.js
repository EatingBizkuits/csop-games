// sizing params start
let boxwidth;
let normal = [0, 0];
let landscape = true;
let difference = 0;
let containerbox = 0;
let courseHeight = 0;
// sizing params end
let courseOption = 0;
let clicked = [];
let selectorLock = true; 
//false to allow .box selection disabled when .clicked is present (on/off switch)
let courseSelected = false;
//once Course is chosen, options are opened
let blinkingInterval = "idle";
// stores blinkingInterval (default | false)
let tracker = [4, 4, 4, 4];
let wordUsed = [];
//randomiser

const courseWords = [ ["Anony-<br>mization", "Algorithm", "AI", "Bayes Theorem", "Behavioural analytics", "Big Data", "Citizen Data Scientist", "Classification", "Clickstream analytics", "Clustering", "Data Governance", "Data Mining", "Data Set", "Data Scientist", "Decision Trees", "Dimension", "Deep Learning", "Machine Learning", "In-Memory Database", "Metadata", "Statistical Outlier", "Predictive Modelling", "Python", "Quantile", "R", "Random Forest", "Standard Deviation"], 
                ["Cloud Computing", "Software", "Domain", "VPN", "Sessions","IP Address", "MAC Address", "Exploits", "Data Breach", "Operating Systems", "Firewall", "Malware", "Ransomware", "Virus", "Trojan", "Worm", "Botnet", "Spyware", "Server", "DDoS", "Phishing", "Encryption", "Pen-Testing", "Social Engineering", "Deepfake", "Forensics", "Crypto- graphy", "Cookie"], 
                ["Domain", "Software", "Cookies", "Python", "Web Development", "Cloud Computing", "Techno- preneurship", "Marketing", "Operating Systems", "Software Engineering", "Frameworks", "Big Data", "Deep Learning", "Machine Learning", "Server", "Robotic Process Automation", "Gaming AI", "DevOps", "E-Commerce", "App Developer", "User Interface", "Networking", "User Experience", "Game Development"], 
                ["Animation", "3D Modelling", "Maya", "Python", "Unity", "Web Development", "Augmented Reality", "Virtual Reality", "Mixed Reality", "Extended Reality", "Art", "Game Development", "User Experience", "Design", "Rendering", "User Interactions", "Sound Effects", "Video Editing", "Rigging", "Topology", "Gamification", "Social Media", "3D Printing", "Product Design", "User Interface", "Texturing", "UV unwrapping", "Meshes", "Environment Design", "Simulation", "Visual Effects"]]
//Source(s): https://bernardmarr.com/data-science-terminology-26-key-definitions-everyone-should-understand/
// 0 - DS, 1 - CSF, 2 - IT, 3 - IM


//Gameplay: Choose Course, Pick 2 that resembles course, Confirm.
//Deselect Course: Click on Course.

$(document).ready(function() {
    $(".game-end, .box").hide();
    initSize();
    setInterval(function(){
        initSize();
    }, 500);

    $(document).on('click', ".play", function(){
        initGame();
        $(".start").addClass("fadeOut");
        setTimeout(function(){
            $(".start").hide();
        }, 800)
    }) 

    $(document).on("click", ".box", function() {
        if ($(this).hasClass("clicked") || selectorLock) {
            return
        }
        if (clicked.length < 2) {
            $(this).addClass("clicked")
            clickedRecord(this);
            if (clicked.length >= 2) {
                $(".activated").addClass("flash").addClass("submit");
                blinkingInterval = setInterval(function(){
                    $(".activated").addClass("flash"); //on
                    window.setTimeout(function(){
                        $(".activated").removeClass("flash");  //off
                    }, 550);
                }, 1500)
            }
        } else {
            showError(this);
        }
    });

    $(document).on("click", ".box.clicked", function(){
        selectorLock = true;
        clicked = clickedDelete(this);
        $(this).removeClass("clicked");
        window.setTimeout(function(){
            selectorLock = false;
            if (clicked.length < 2) {
                clearInterval(blinkingInterval);
                blinkingInterval = "idle";
                $(".submit").removeClass("submit");
                $(".flash").removeClass("flash");
            }
        }, 200);
    });

    $(document).on("click", ".courses", function(){
        if (courseSelected) {
            //if course is locked, dont allow other selections
            return
        }
        courseSelected = true;
        $(this).addClass("activated");
        $(".courses:not(.activated)").addClass("deactivated");
        selectorLock = false;
        $(".box.deactivated").removeClass("deactivated")
        $(".cont-bg").hide()
        $(".cont-bg, .box").addClass("fadeIn");
        $(".box").show();
    })

    $(document).on("click", ".courses.activated", function(){
        //choose another course
        if (blinkingInterval === "idle" && courseSelected) {
            $(this).removeClass("activated");
            $(".courses.deactivated").removeClass("deactivated");
            $(".clicked").removeClass("clicked");
            clicked = [];
            $(".box").addClass("deactivated");
            courseSelected = false;
            selectorLock = true;
            $(".cont-bg").show();
            $(".box").hide();
        }    
    });

    $(document).on("click", ".submit", function() {
        let finalCourse = $(this).html();
        finalCourse = abbreviation2Word(finalCourse);
        $(".game-end").show().addClass("fadeIn");
        clearInterval(blinkingInterval);
        blinkingInterval = "idle";
        $(".submit").removeClass("submit");
        $(".flash").removeClass("flash");
        const final = $(".clicked");
        const displayBox = $(".choice .show");
        for (let i = 0; i < final.length; i++) {
            $(displayBox[i]).html($(final[i]).html());
            let text = gameResult($(final[i]).html())
            let finalText = "";
            let noSpacing = false;
            for (let j = 0; j < text.length; j++) {
                if (finalCourse == text[j]) {
                    $(displayBox[i]).addClass("correct");
                }
                if (noSpacing) {
                    finalText += ",<br>"
                }
                noSpacing = true;
                finalText += text[j]
            }
            $(displayBox[i]).next().append(finalText);
        }
    });

    $(document).on("click", ".refresh", function() {
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
        boxwidth = window.innerWidth * 0.8
        landscape = false;
        return $(".bg, .course-container").addClass("wrap");
        
    }
    $(".bg, .course-container").removeClass("wrap");
    landscape = true;
    // Height > Width (Use smaller) (Portrait view)
}

function setSize() {
    containerbox = boxwidth * 0.90
    courseHeight = boxwidth * 0.3
    courseOption = boxwidth * 0.2

    $(".container, .cont-bg").width(containerbox).height(containerbox);
    $(".bg").width(window.innerWidth).height(window.innerHeight);
    $(".box").width(containerbox * 0.23).height(containerbox * 0.23)
    $(".row").height(containerbox);
    if (landscape) {
        $(".course-container").width(courseHeight * 0.8).height(containerbox).addClass("wrap");
        $(".courses").width(courseOption).height(courseOption * 0.6);
    } else {
        $(".course-container").width(containerbox).height(courseHeight * 0.65).removeClass("wrap");
        $(".courses").width(courseOption).height(courseOption * 0.6);
    }
}
// Display & Structural Settings End

// Handle Choices Interactions
function clickedRecord(selected) {
    for (let i = 0; i < clicked.length; i++) {
        if (clicked[i] === selected) {
            return
        }
    }
    clicked.push(selected);
}

function clickedDelete(selected) {
    let edited = [];
    for (let i = 0; i <clicked.length; i++) {
        if (clicked[i] === selected) {
            // if the newly clicked has been selected before, 
            //skip it, leaving it out of the updated array
            continue;
        }
        edited.push(clicked[i]);
    }
    return edited;
}
// Handle Choices Interactions End

// Handle Blinks
function showError(selected) {
    $(selected).addClass("error");  // on
    window.setTimeout(function(){
        $(selected).removeClass("error");  // off
        window.setTimeout(function(){
            $(selected).addClass("error");  // on
            window.setTimeout(function(){
                $(selected).removeClass("error");  //off
            }, 75);
        }, 75)
    }, 75);
}
// Handle Blinks End

// Game Initialisation
function initGame() {
    chooseWords();
    initSize();
}

function chooseWords() {
    tracker = [4, 4, 4, 4];
    const boxes = $(".box");
    for (let i = 0; i < boxes.length; i++) {
        $(boxes[i]).html(randomiser())
    }
}

function randomiser() {
    // randomiser chooses Course
    // 0 - DS, 1 - CSF, 2 - IT, 3 - IM
    let run = true;
    while (run) {
        course = Math.floor(Math.random() * 4)
        if (tracker[course] < 1) {
            continue;
            //repeat if course quota is filled
        }
        let chosen = courseWords[course]
        let word = Math.floor(Math.random() * chosen.length)
        if (inArray(chosen[word], wordUsed)){
            continue;
        }
        wordUsed.push(chosen[word]);
        tracker[course] += 1;
        return chosen[word];
    }
}

function inArray(word, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === word) {
            return true;
            // if word is in array
        }
    }
    return false;
}
//Game Initialisation End

// Game Result
function gameResult(word) {
    let relation = [];
    let temp = [];
    for (let c = 0; c < courseWords.length; c++) {
        for (let d = 0; d < courseWords[c].length; d++) {
            if (courseWords[c][d] == word) {
                relation.push(c);
            }
        }
    }
    for (let i = 0; i < relation.length; i++) {
        if (relation[i] == 0) {
            temp.push("Data Science")
        } else if (relation[i] == 1) {
            temp.push("Cybersecurity and Digital Forensics")
        } else if (relation[i] == 2) {
            temp.push("Information Technology")
        } else {
            temp.push("Immersive Media")
        }
    }
    console.log(temp)
    return temp;
}

function abbreviation2Word(abbrv) {
    if (abbrv == "IM") {
        return "Immersive Media"
    } else if (abbrv == "CSF") {
        return "Cybersecurity and Digital Forensics"
    } else if (abbrv == "DS") {
        return "Data Science"
    } else if (abbrv == "IT") {
        return "Information Technology"
    } else {
        return false;
    }
}
// Game Result End
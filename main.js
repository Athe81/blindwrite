"use strict";
const TXT_LENGTH = 50;
const HINT_DELAY = 1500;

var hint = function() {
    var storedKeyDOM, timer;

    var reset = function() {
        window.clearTimeout(timer);
        if (typeof(storedKeyDOM) !== "undefined") {
            storedKeyDOM.setAttribute("fill-opacity", 0);
        }
    };

    var set =  function(keyDOM) {
        reset();
        storedKeyDOM = keyDOM;
        timer = window.setTimeout(function() {
            storedKeyDOM.setAttribute("fill", "#447744");
            storedKeyDOM.setAttribute("fill-opacity", 1);
        }, HINT_DELAY);
    };

    return {
        reset, 
        set
    };
}();

function exercise() {
    var lessonString, pos, error, timeStamp;
    var keyLogging = {};
    var rankedKeys = JSON.parse(localStorage.getItem("rankedKeys"));
    var orderdKeys = JSON.parse(localStorage.getItem("orderdKeys"));

    var txtDone = document.getElementById('txtDone');
    var txtNow = document.getElementById('txtNow');
    var txtNext = document.getElementById('txtNext');

    document.getElementById("exercise").classList.remove("hide");
    keyboard.setKeyboard(localStorage.keyboard);
    newLesson();

    window.onkeypress = function(event){
        checkInput(event);
    };

    function updateView() {
        txtDone.innerHTML = lessonString.substring(0, pos);
        txtNow.innerHTML = lessonString[pos] || "";
        txtNow.classList.remove("error");
        txtNext.innerHTML = lessonString.substring(pos+1, TXT_LENGTH);

        if (pos === 0) {
            var buffer = "";
            for (var i = 0; i < rankedKeys.length; i++) {
                buffer += '<span class="keycapMini" title="Points: ';
                buffer += rankedKeys[i].points;
                buffer += '">';
                buffer += rankedKeys[i].key;
                buffer += '</span>';
            }
            document.getElementById("keysRanked").innerHTML = buffer;
            buffer = "";
            for (var i = rankedKeys.length; i < orderdKeys.length; i++) {
                buffer += '<span class="keycapMini">';
                buffer += orderdKeys[i];
                buffer += '</span>';
            }
            document.getElementById("keysNext").innerHTML = buffer;
        }
    };

    function newLesson() {
        var space = 4 + Math.floor(Math.random() * 4);
        if (rankedKeys[rankedKeys.length-1].points > 1500 &&
            rankedKeys[rankedKeys.length-1].count > 40
           ) {
               rankedKeys.push({
                   "key": orderdKeys[rankedKeys.length],
                   "points": 0,
                   "count": 0
               });
           }

        keyLogging = {};
        lessonString = "";
        pos = 0;
        for ( var i = 0; i < TXT_LENGTH; i++ ) {
            if (i === space && i < TXT_LENGTH-2) {
                lessonString += " ";
                space += 4 + Math.floor(Math.random() * 4);
                continue;
            }
            var keyPos = Math.floor(Math.random() * rankedKeys.length);
            lessonString += orderdKeys[keyPos];
        }
        updateView();
        hint.set(keyboard.getDOM(lessonString[pos]));
    };

    function checkInput(event) {
        if (lessonString[pos] === String.fromCharCode(event.which)) {
            var timeStampEnd = new Date().getTime();
            if (pos !== 0) {
                var key = lessonString[pos];
                if (typeof(keyLogging[key]) === "undefined") {
                    keyLogging[key] = {count: 0, time: 0, err: 0};
                }
                keyLogging[key].count++;
                keyLogging[key].time += timeStampEnd - timeStamp;
                keyLogging[key].err += error;
            }
            pos++;
            if (pos < TXT_LENGTH) {
                hint.set(keyboard.getDOM(lessonString[pos]));
            } else {
                calculatePoints();
                hint.reset();
                newLesson();
            }
            updateView();
            timeStamp = new Date().getTime();
            error = false;
        } else {
            txtNow.classList.add("error");
            error = true;
        }
    };

    function calculatePoints() {
        for (var r in rankedKeys) {
            var k = rankedKeys[r].key;
            if (typeof(keyLogging[k]) === "undefined") {
                continue;
            }
            var speed = 2000 - (keyLogging[k].time / keyLogging[k].count);
            if (speed < 0) {speed = 0};
            var errors = (1 - (keyLogging[k].err / keyLogging[k].count));
            var points = (speed*errors);
            points += rankedKeys[r].points * 2;
            points /= 3;
            rankedKeys[r].points = points.toFixed(2);
            rankedKeys[r].count += keyLogging[k].count;
        }
        rankedKeys.sort(function(a, b){return b.points - a.points});
        localStorage.setItem("rankedKeys", JSON.stringify(rankedKeys));
    };
};

var keyboard = function(){
    var keyDOMs = {};

    function setKeyboard(){
        document.getElementById("keyboard").innerHTML =
            keyboards[localStorage.keyboard]["svg"];
        var layout = keyboards[localStorage.keyboard]["layout"][localStorage.layout]["mapping"];
        for (var l in layout) {
            keyDOMs[l] = document.getElementById(layout[l]);
        }
    };
    
    function getDOM(key) {
        return keyDOMs[key];
    };

    return {
        setKeyboard,
        getDOM
    };
}();

function setup() {
    var setup = document.getElementById("setup");
    var saveConfig = document.getElementById("saveConfig");
    var selectKeyboard = document.getElementById("selectKeyboard");

    setup.classList.remove("hide");
    updateKeyboards();

    function updateKeyboards() {
        for (var k in keyboards) {
            var option = document.createElement("option");
            option.text = k;
            selectKeyboard.add(option);
        }
        selectKeyboard.selectedIndex = -1;
        selectKeyboard.onchange = function(event) {
            updateLayout(event.target.value);
            showKeyboardPreview(event.target.value);
        };
    };

    function showKeyboardPreview(keyboardType) {
        document.getElementById("preview").innerHTML = keyboards[keyboardType]["svg"]
    }

    function updateLayout(keyboardType) {
        var selectLayout = document.getElementById("selectLayout");
        selectLayout.innerHTML = "";
        for (var l in keyboards[keyboardType].layout) {
            var option = document.createElement("option");
            option.text = l;
            selectLayout.add(option);
        }
        selectLayout.selectedIndex = -1;
    };

    function createOrder() {
        var orderdKeys = [];
        var layout = keyboards[localStorage.keyboard]["layout"][localStorage.layout];
        var order = keyboards[localStorage.keyboard]["ordering"];
        for (var o = 0; o < order.length; o++) {
            for (var l in layout["mapping"]) {
                if (layout["mapping"][l] === order[o] &&
                    language[layout["language"]].indexOf(l) !== -1
                   ) {
                       orderdKeys.push(l);
                   }
            }
        }
        localStorage.setItem("orderdKeys", JSON.stringify(orderdKeys));
        var rankedKeys = [];
        for (var i = 0; i < 4; i++) {
            rankedKeys.push({
                "key": orderdKeys[i],
                "points": 0,
                "count": 0
            });
        }
        localStorage.setItem("rankedKeys", JSON.stringify(rankedKeys));
    };

    function save() {
        if (
            selectKeyboard.selectedIndex === -1 ||
            selectLayout.selectedIndex === -1
        ) {
            alert("You have to select a keyboard design and a layout");
            return;
        };

        localStorage.keyboard = selectKeyboard.value;
        localStorage.layout = selectLayout.value;
        createOrder();
        setup.classList.add("hide");
        exercise();
    };

    saveConfig.onclick = function() {
        save();
    };
    saveConfig.onkeydown = function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            save();
        };
    };
};

function showWelcome() {
    var welcome = document.getElementById("welcome");
    var startSetup = document.getElementById("startSetup");

    welcome.classList.remove("hide");
    startSetup.onclick = function() {
        welcome.classList.add("hide");
        setup();
    };
    startSetup.onkeydown = function(event) {
        if (event.keyCode === 13) {
            welcome.classList.add("hide");
            setup();
        };
    };
};

function setKey(key) {
    console.log(key);
};

function init() {
    //window.localStorage.clear();

    // drop backspace
    document.addEventListener("keydown", function(event) {
        if (event.which === 8) {
           event.preventDefault();
        }
    });

    if (
        typeof(localStorage.keyboard) === "undefined" ||
        typeof(localStorage.layout) === "undefined" ||
        typeof(localStorage.orderdKeys) === "undefined" ||
        typeof(localStorage.rankedKeys) === "undefined"
    ) {
        showWelcome();
    } else {
        exercise();
    }
}

"use strict";
var TXT_LENGTH = 50;
var HINT_DELAY = 1500;

var hint = function() {
    var storedKeyDOM;
    var timer;

    var reset = function() {
        window.clearTimeout(timer);
        if ("classList" in storedKeyDOM) {
            storedKeyDOM.classList.remove("hint");
        }
    };

    var set =  function(keyDOM) {
        reset();
        storedKeyDOM = keyDOM;
        timer = window.setTimeout(function() {
            storedKeyDOM.classList.add("hint");
        }, HINT_DELAY);
    };

    return {
        reset: reset,
        set: set
    };
}();

function exercise() {
    var lessonString;
    var pos;
    var error;
    var timeStamp;
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
            rankedKeys.forEach(function(item, _) {
                buffer += '<span class="keycapMini" title="Points: ';
                buffer += item.points;
                buffer += '">';
                buffer += item.key;
                buffer += '</span>';
            });
            document.getElementById("keysRanked").innerHTML = buffer;
            buffer = "";
            orderdKeys.forEach(function(item, _) {
                buffer += '<span class="keycapMini">';
                buffer += item;
                buffer += '</span>';
            });
            document.getElementById("keysNext").innerHTML = buffer;
        }
    }

    function newLesson() {
        var space = 4 + Math.floor(Math.random() * 4);
        if (rankedKeys[rankedKeys.length-1].points > 1500) {
               rankedKeys.push({
                   "key": orderdKeys[0],
                   "points": 0,
                   "count": 0
               });
                orderdKeys.splice(0, 1);
                localStorage.setItem("rankedKeys", JSON.stringify(rankedKeys));
                localStorage.setItem("orderdKeys", JSON.stringify(orderdKeys));
           }

        keyLogging = {};
        lessonString = "";
        pos = 0;
        for (var i = 0; i < TXT_LENGTH; i++) {
            if (i === space && i < TXT_LENGTH-2) {
                lessonString += " ";
                space += 4 + Math.floor(Math.random() * 4);
                continue;
            }
            var keyPos = Math.floor(Math.random() * rankedKeys.length);
            lessonString += rankedKeys[keyPos].key;
        }
        updateView();
        hint.set(keyboard.getDOM(lessonString[pos]));
    }

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
    }

    function calculatePoints() {
        rankedKeys.forEach(function(item, index) {
            var k = item.key;
            if (typeof(keyLogging[k]) === "undefined") {
                return;
            }
            var speed = 2000 - (keyLogging[k].time / keyLogging[k].count);
            if (speed < 0) {
                speed = 0;
            }
            var errors = (1 - (keyLogging[k].err / keyLogging[k].count));
            var points = (speed*errors);
            if (item.points !== 0) {
                points += item.points * 2;
                points /= 3;
            }
            rankedKeys[index].points = points.toFixed(2);
            rankedKeys[index].count += keyLogging[k].count;
        });
        rankedKeys.sort(function(a, b){
            return b.points - a.points;
        });
        localStorage.setItem("rankedKeys", JSON.stringify(rankedKeys));
    }
}

var keyboard = function(){
    var keyDOMs = {};

    function setKeyboard(){
        document.getElementById("keyboard").innerHTML =
            keyboards[localStorage.keyboard].svg;
        var layout = keyboards[localStorage.keyboard].layout[localStorage.layout].mapping;
        for (var l in layout) {
            keyDOMs[l] = document.getElementById(layout[l]);
        }
    }

    function getDOM(key) {
        return keyDOMs[key];
    }

    return {
        setKeyboard: setKeyboard,
        getDOM: getDOM
    };
}();

function setup() {
    var setup = document.getElementById("setup");
    var setupLanguage = document.getElementById("setupLanguage");
    var setupLayout = document.getElementById("setupLayout");
    var saveConfig = document.getElementById("saveConfig");
    var selectKeyboard = document.getElementById("selectKeyboard");
    var selectLayout = document.getElementById("selectLayout");
    var ownLayout = document.getElementById("ownLayout");
    var selectLanguage = document.getElementById("selectLanguage");
    var startLayoutConfig = document.getElementById("startLayoutConfig");

    setup.classList.remove("hide");
    updateKeyboards();

    selectKeyboard.onchange = function(event) {
        updateLayout(event.target.value);
        showKeyboardPreview(event.target.value);
        selectLayout.disabled = false;
        //ownLayout.disabled = false;
    };

    selectLayout.onchange = function() {
        saveConfig.disabled = false;
    };

    ownLayout.onclick = function() {
        setup.classList.add("hide");
        for (var l in languages) {
            var option = document.createElement("option");
            option.text = l;
            selectLanguage.add(option);
        }
        setupLanguage.classList.remove("hide");
    };

    startLayoutConfig.onclick = function() {
        setupLanguage.classList.add("hide");
        document.getElementById("setupLayoutKeyboard").innerHTML =
            keyboards[selectKeyboard.value].svg;
        setupLayout.classList.remove("hide");
        localStorage.keyboard = selectKeyboard.value;
        configKeys.setLanguage(languages[selectLanguage.value]);
    };

    function updateKeyboards() {
        selectKeyboard.innerHTML = "";
        for (var k in keyboards) {
            var option = document.createElement("option");
            option.text = k;
            selectKeyboard.add(option);
        }
        selectKeyboard.selectedIndex = -1;
    }

    function showKeyboardPreview(keyboardType) {
        document.getElementById("preview").innerHTML = keyboards[keyboardType].svg;
    }

    function updateLayout(keyboardType) {
        selectLayout.innerHTML = "";
        for (var l in keyboards[keyboardType].layout) {
            var option = document.createElement("option");
            option.text = l;
            selectLayout.add(option);
        }
        selectLayout.selectedIndex = -1;
        selectLayout.disabled = true;
    }

    function createOrder() {
        var orderdKeys = [];
        var layout = keyboards[localStorage.keyboard].layout[localStorage.layout];
        var order = keyboards[localStorage.keyboard].ordering;
        for (var o = 0; o < order.length; o++) {
            for (var l in layout.mapping) {
                if (layout.mapping[l] === order[o] &&
                    languages[layout.language].indexOf(l) !== -1
                   ) {
                       orderdKeys.push(l);
                   }
            }
        }
        var rankedKeys = [];
        for (var i = 0; i < 4; i++) {
            rankedKeys.push({
                "key": orderdKeys[0],
                "points": 0,
                "count": 0
            });
            orderdKeys.splice(0, 1);
        }
        localStorage.setItem("rankedKeys", JSON.stringify(rankedKeys));
        localStorage.setItem("orderdKeys", JSON.stringify(orderdKeys));
    }

    function save() {
        if (
            selectKeyboard.selectedIndex === -1 ||
            selectLayout.selectedIndex === -1
        ) {
            alert("You have to select a keyboard design and a layout");
            return;
        }

        localStorage.keyboard = selectKeyboard.value;
        localStorage.layout = selectLayout.value;
        createOrder();
        setup.classList.add("hide");
        exercise();
    }

    saveConfig.onclick = function() {
        save();
    };
}

function showWelcome() {
    var welcome = document.getElementById("welcome");
    var startSetup = document.getElementById("startSetup");

    welcome.classList.remove("hide");
    startSetup.onclick = function() {
        welcome.classList.add("hide");
        setup();
    };
}

var configKeys = function() {
    var lang;
    var pos = 0;
    var mapping = {};
    var setupLayoutKey = document.getElementById("setupLayoutKey");

    function update() {
        if (pos < lang.length) {
            setupLayoutKey.innerHTML = lang[pos];
            pos++;
        } else {
            console.log("finished");
        }
    }

    function setLanguage(l) {
        lang = l;
        update();
    }

    function setKey(id) {
        if (typeof(lang) === "undefined") {
            return;
        };
        mapping[lang[pos - 1]] = id;
        update();
    }

    return {
        setLanguage: setLanguage,
        setKey: setKey
    }
}();

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

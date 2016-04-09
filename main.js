"use strict";
var TXT_LENGTH = 50;
var HINT_DELAY = 1500;

var hint = function() {
    var storedKeyDOM;
    var timer;

    var reset = function() {
        window.clearTimeout(timer);
        if (typeof(storedKeyDOM) !== "undefined") {
            storedKeyDOM.classList.remove("hint");
        }
    };

    var set = function(keyDOM) {
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
        keyLogging = {};
        pos = 0;

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

        var keys = [];
        rankedKeys.forEach(function(element) {
            keys.push(element.key);
        });
        lessonString = generateList("de_DE", keys, TXT_LENGTH);
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
            document.getElementById(layout[l] + 'K').innerHTML = l.toUpperCase();
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

function setupLanguage() {
    var setupLanguage = document.getElementById("setupLanguage");
    var selectLanguage = document.getElementById("selectLanguage");
    var startLayoutConfig = document.getElementById("startLayoutConfig");
    
    setupLanguage.style.display = "block";
    for (var l in languages) {
        var option = document.createElement("option");
        option.text = l;
        selectLanguage.add(option);
    }

    startLayoutConfig.onclick = function() {
        setupOwnLayout(selectKeyboard.value, selectLanguage.value);
        setupLanguage.style.display = "none";
    };
}

function setup() {
    var setup = document.getElementById("setup");
    var setupLayout = document.getElementById("setupLayout");
    var saveConfig = document.getElementById("saveConfig");
    var selectKeyboard = document.getElementById("selectKeyboard");
    var selectLayout = document.getElementById("selectLayout");
    var ownLayout = document.getElementById("ownLayout");
    var preview = document.getElementById("preview");

    setup.style.display = "block";
    updateKeyboards();

    selectKeyboard.onchange = function(event) {
        updateLayout(event.target.value);
        preview.innerHTML = keyboards[event.target.value].svg;
        selectLayout.disabled = false;
        //ownLayout.disabled = false;
    };

    selectLayout.onchange = function() {
        saveConfig.disabled = false;
    };

    ownLayout.onclick = function() {
        preview.innerHTML = "";
        setup.style.display = "none";
        setupLanguage();
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
        var rankedKeys = [];
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
        localStorage.keyboard = selectKeyboard.value;
        localStorage.layout = selectLayout.value;
        createOrder();
        preview.innerHTML = "";
        setup.style.display = "none";
        exercise();
    }

    saveConfig.onclick = function() {
        save();
    };
}

function showWelcome() {
    var welcome = document.getElementById("welcome");
    var startSetup = document.getElementById("startSetup");

    welcome.style.display = "block";
    startSetup.onclick = function() {
        welcome.style.display = "none";
        setup();
    };
}

function setupOwnLayout(keyboard, language) {
    var setupLayout = document.getElementById("setupLayout");
    var activeId;
    var letters;
    var mapping = {};
    var defaultLetters = [".", ",", "'"];

    function setKey(event) {
        var key = String.fromCharCode(event.which).toLowerCase();

        if (activeId === undefined) {
            return;
        };
        if (mapping.hasOwnProperty(key) === false) {
            return;
        };
        if (mapping[key] !== undefined) {
            document.getElementById(mapping[key] + 'K').innerHTML = "";
        };
        for (var k in mapping) {
            if (mapping[k] === activeId) {
                mapping[k] = undefined;
            };
        }
        document.getElementById(activeId + 'K').innerHTML = key.toUpperCase();
        mapping[key] = activeId;
        updateView();
    }

    function updateView() {
        var undefKeys = [];

        for (var k in mapping) {
            if (mapping[k] === undefined) {
                undefKeys.push('<span class="keycapMini">');
                undefKeys.push(k);
                undefKeys.push('</span>');
            };
        };
        document.getElementById("letters").innerHTML = undefKeys.join("");
    }

    function save() {
        document.removeEventListener("keydown", setKey);
        keyboards[keyboard].ordering.forEach(function(element) {
            document.getElementById(element).onclick=function(){};
            document.getElementById("setupLayoutSave").removeEventListener("click", save);
        });
    }

    letters = languages[language];
    letters = letters.concat(defaultLetters);
    letters.forEach(function(letter) {
        mapping[letter] = undefined;
    });

    setupLayout.style.display = "block";

    document.getElementById("setupLayoutKeyboard").innerHTML =
        keyboards[keyboard].svg;
    keyboards[keyboard].ordering.forEach(function(element) {
        document.getElementById(element).onclick=function(){
            if (activeId !== undefined) {
                document.getElementById(activeId).classList.remove("hint");
            };
            activeId = element;
            document.getElementById(activeId).classList.add("hint");
        };
    });

    document.getElementById("setupLayoutSave").addEventListener("click", save);
    document.addEventListener("keydown", setKey);

    updateView();
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

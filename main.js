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

var config = function() {
    var c = {
        active: undefined,
        data: {}
    };

    function storedConfigs() {
        var result = [];
        for (var d in c.data) {
            result.push(d);
        };
        return result;
    }

    function setActiveConfig(configName) {
        if (c.data[configName] === undefined) {
            console.log("Error: Unknown config name: " + configName);
            return false;
        };
        c.active = configName;
        return true;
    }

    function addConfig(keyboard, language, layout) {
        var orderdKeys = [];
        var rankedKeys = [];
        var name = keyboard + "_" + layout + " (" + language + ")";
        var keyConfig = keyboards[keyboard].layout[language][layout];
        var order = keyboards[keyboard].ordering;

        for (var o in order) {
            for (var l in keyConfig) {
                if (keyConfig[l] === order[o] &&
                    languages[language].indexOf(l) !== -1
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

        c.active = name;
        c.data[name] = {
            keyboard: keyboard,
            language: language,
            layout: layout,
            rankedKeys: rankedKeys,
            orderdKeys: orderdKeys
        };
        save();
    }

    function updateKeys(rankedKeys, orderdKeys) {
        c.data[c.active].rankedKeys = rankedKeys;
        c.data[c.active].orderdKeys = orderdKeys;
        save();
    }

    function get(key) {
        return c.data[c.active][key];
    }

    function save() {
        localStorage.setItem("configs", JSON.stringify(c));
    }

    function isNew() {
        if (c.active === undefined) {
            return true;
        };
        return false;
    }

    if (window.localStorage.configs !== undefined) {
        c = JSON.parse(window.localStorage.configs);
    };

    return {
        isNew: isNew,
        addConfig: addConfig,
        updateKeys: updateKeys,
        get: get,
        save: save,
    }
}();

function exercise() {
    var lessonString;
    var pos;
    var error;
    var timeStamp;
    var keyLogging = {};
    var rankedKeys = config.get("rankedKeys");
    var orderdKeys = config.get("orderdKeys");

    var txtDone = document.getElementById('txtDone');
    var txtNow = document.getElementById('txtNow');
    var txtNext = document.getElementById('txtNext');

    keyboard.setKeyboard(config.get("keyboard"));
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
        var keys = [];

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
            config.updateKeys(rankedKeys, orderdKeys);
        };

        rankedKeys.forEach(function(element) {
            keys.push(element.key);
        });

        lessonString = generateList("de_DE", keys, TXT_LENGTH); /*TODO:  */
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
        config.updateKeys(rankedKeys, orderdKeys);
    }
}

var keyboard = function(){
    var keyDOMs = {};

    function setKeyboard(){
        document.getElementById("keyboard").innerHTML =
            keyboards[config.get("keyboard")].svg;
        var layout = keyboards[config.get("keyboard")]
            .layout[config.get("language")]
            [config.get("layout")];
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

    saveConfig.onclick = function() {
        save();
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
        for (var language in keyboards[keyboardType].layout) {
            for (var layout in keyboards[keyboardType].layout[language]) {
                var option = document.createElement("option");
                option.text = layout + " (" + language + ")";
                option.value = JSON.stringify({layout, language});
                selectLayout.add(option);
            };
        };
        selectLayout.selectedIndex = -1;
        selectLayout.disabled = true;
    }

    function save() {
        var layout = JSON.parse(selectLayout.value);
        config.addConfig(selectKeyboard.value,
                         layout.language,
                         layout.layout);
        preview.innerHTML = "";
        setup.style.display = "none";
        exercise();
    }
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
        event.preventDefault();
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
        for (var k in mapping) {
            if (mapping[k] === undefined) {
                return;
            };
        };

    }

    function save() {
        document.removeEventListener("keypress", setKey);
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
    document.addEventListener("keypress", setKey);

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

    if (config.isNew() === true) {
        showWelcome();
    } else {
        exercise();
    }
}

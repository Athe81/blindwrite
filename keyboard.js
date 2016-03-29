var keyboards = {
    "ergodox": {
        "svg":
            '<svg id="keyboardSVG" height="81.684mm" viewBox="0 0 825.51069 289.4326" width="232.98mm" version="1.1">' +
            '<g stroke="#000000">' +
            '<g id="layer1" stroke-linejoin="round" fill-opacity="0" transform="translate(-38.513 -34.122)" stroke-width="2">' +
            '<path id="Lkeyboard" style="image-rendering:auto" d="m76.6 42.209c-16.62 0-30 13.38-30 30v140c0 16.62 13.38 30 30 30h113.09l178.89 71.119c15.444 6.1399 32.821-1.3506 38.961-16.795l26.254-66.043c6.1398-15.444-1.3506-32.821-16.795-38.961l-57.188-22.734v-96.586c0-16.62-13.38-30-30-30h-253.21z"/>' +
            '<rect id="L00" rx="5" ry="5" height="30" width="60" y="57" x="63" onclick="configKeys.setKey(\'L00\')"/>' +
            '<rect id="L01" rx="5" ry="5" height="30" width="60" y="93" x="63" onclick="configKeys.setKey(\'L01\')"/>' +
            '<rect id="L02" rx="5" ry="5" height="30" width="60" y="129" x="63" onclick="configKeys.setKey(\'L02\')"/>' +
            '<rect id="L03" rx="5" ry="5" height="30" width="60" y="165" x="63" onclick="configKeys.setKey(\'L03\')"/>' +
            '<rect id="L04" rx="5" ry="5" height="30" width="30" y="201" x="93" onclick="configKeys.setKey(\'L04\')"/>' +
            '<rect id="L10" rx="5" ry="5" height="30" width="30" y="57" x="129" onclick="configKeys.setKey(\'L10\')"/>' +
            '<rect id="L11" rx="5" ry="5" height="30" width="30" y="93" x="129" onclick="configKeys.setKey(\'L11\')"/>' +
            '<rect id="L12" rx="5" ry="5" height="30" width="30" y="129" x="129" onclick="configKeys.setKey(\'L12\')"/>' +
            '<rect id="L13" rx="5" ry="5" height="30" width="30" y="165" x="129" onclick="configKeys.setKey(\'L13\')"/>' +
            '<rect id="L14" rx="5" ry="5" height="30" width="30" y="201" x="129" onclick="configKeys.setKey(\'L14\')"/>' +
            '<rect id="L20" rx="5" ry="5" height="30" width="30" y="57" x="165" onclick="configKeys.setKey(\'L20\')"/>' +
            '<rect id="L21" rx="5" ry="5" height="30" width="30" y="93" x="165" onclick="configKeys.setKey(\'L21\')"/>' +
            '<rect id="L22" rx="5" ry="5" height="30" width="30" y="129" x="165" onclick="configKeys.setKey(\'L22\')"/>' +
            '<rect id="L23" rx="5" ry="5" height="30" width="30" y="165" x="165" onclick="configKeys.setKey(\'L23\')"/>' +
            '<rect id="L24" rx="5" ry="5" height="30" width="30" y="201" x="165" onclick="configKeys.setKey(\'L24\')"/>' +
            '<rect id="L30" rx="5" ry="5" height="30" width="30" y="57" x="201" onclick="configKeys.setKey(\'L30\')"/>' +
            '<rect id="L31" rx="5" ry="5" height="30" width="30" y="93" x="201" onclick="configKeys.setKey(\'L31\')"/>' +
            '<rect id="L32" rx="5" ry="5" height="30" width="30" y="129" x="201" onclick="configKeys.setKey(\'L32\')"/>' +
            '<rect id="L33" rx="5" ry="5" height="30" width="30" y="165" x="201" onclick="configKeys.setKey(\'L33\')"/>' +
            '<rect id="L34" rx="5" ry="5" height="30" width="30" y="201" x="201" onclick="configKeys.setKey(\'L34\')"/>' +
            '<rect id="L40" rx="5" ry="5" height="30" width="30" y="57" x="237" onclick="configKeys.setKey(\'L40\')"/>' +
            '<rect id="L41" rx="5" ry="5" height="30" width="30" y="93" x="237" onclick="configKeys.setKey(\'L41\')"/>' +
            '<rect id="L42" rx="5" ry="5" height="30" width="30" y="129" x="237" onclick="configKeys.setKey(\'L42\')"/>' +
            '<rect id="L43" rx="5" ry="5" height="30" width="30" y="165" x="237" onclick="configKeys.setKey(\'L43\')"/>' +
            '<rect id="L44" rx="5" ry="5" height="30" width="30" y="201" x="237" onclick="configKeys.setKey(\'L44\')"/>' +
            '<rect id="L50" rx="5" ry="5" height="30" width="30" y="57" x="273" onclick="configKeys.setKey(\'L50\')"/>' +
            '<rect id="L51" rx="5" ry="5" height="30" width="30" y="93" x="273" onclick="configKeys.setKey(\'L51\')"/>' +
            '<rect id="L52" rx="5" ry="5" height="30" width="30" y="129" x="273" onclick="configKeys.setKey(\'L52\')"/>' +
            '<rect id="L53" rx="5" ry="5" height="30" width="30" y="165" x="273" onclick="configKeys.setKey(\'L53\')"/>' +
            '<rect id="L60" rx="5" ry="5" height="30" width="30" y="57" x="309" onclick="configKeys.setKey(\'L60\')"/>' +
            '<rect id="L61" rx="5" ry="5" height="48" width="30" y="93" x="309" onclick="configKeys.setKey(\'L61\')"/>' +
            '<rect id="L62" rx="5" ry="5" height="48" width="30" y="147" x="309" onclick="configKeys.setKey(\'L62\')"/>' +
            '<rect id="L63" transform="rotate(21.68)" rx="5" ry="5" height="66" width="30" y="76" x="362" onclick="configKeys.setKey(\'L63\')"/>' +
            '<rect id="L70" transform="rotate(21.68)" rx="5" ry="5" height="30" width="30" y="40" x="398" onclick="configKeys.setKey(\'L70\')"/>' +
            '<rect id="L71" transform="rotate(21.68)" rx="5" ry="5" height="66" width="30" y="76" x="398" onclick="configKeys.setKey(\'L71\')"/>' +
            '<rect id="L80" transform="rotate(21.68)" rx="5" ry="5" height="30" width="30" y="40" x="434" onclick="configKeys.setKey(\'L80\')"/>' +
            '<rect id="L81" transform="rotate(21.68)" rx="5" ry="5" height="30" width="30" y="76" x="434" onclick="configKeys.setKey(\'L81\')"/>' +
            '<rect id="L82" transform="rotate(21.68)" rx="5" ry="5" height="30" width="30" y="112" x="434" onclick="configKeys.setKey(\'L82\')"/>' +
            '<path id="Rkeyboard" style="image-rendering:auto" d="m825.94 42.209c16.62 0 30 13.38 30 30v140c0 16.62-13.38 30-30 30h-113.09l-178.89 71.119c-15.444 6.1399-32.821-1.3506-38.961-16.795l-26.254-66.043c-6.1398-15.444 1.3506-32.821 16.795-38.961l57.188-22.734v-96.586c0-16.62 13.38-30 30-30h253.21z"/>' +
            '<rect id="R60" rx="5" ry="5" height="30" width="30" y="57" x="563" onclick="configKeys.setKey(\'R60\')"/>' +
            '<rect id="R61" rx="5" ry="5" height="48" width="30" y="93" x="563" onclick="configKeys.setKey(\'R61\')"/>' +
            '<rect id="R62" rx="5" ry="5" height="48" width="30" y="147" x="563" onclick="configKeys.setKey(\'R62\')"/>' +
            '<rect id="R50" rx="5" ry="5" height="30" width="30" y="57" x="599" onclick="configKeys.setKey(\'R50\')"/>' +
            '<rect id="R51" rx="5" ry="5" height="30" width="30" y="93" x="599" onclick="configKeys.setKey(\'R51\')"/>' +
            '<rect id="R52" rx="5" ry="5" height="30" width="30" y="129" x="599" onclick="configKeys.setKey(\'R52\')"/>' +
            '<rect id="R53" rx="5" ry="5" height="30" width="30" y="165" x="599" onclick="configKeys.setKey(\'R53\')"/>' +
            '<rect id="R40" rx="5" ry="5" height="30" width="30" y="57" x="635" onclick="configKeys.setKey(\'R40\')"/>' +
            '<rect id="R41" rx="5" ry="5" height="30" width="30" y="93" x="635" onclick="configKeys.setKey(\'R41\')"/>' +
            '<rect id="R42" rx="5" ry="5" height="30" width="30" y="129" x="635" onclick="configKeys.setKey(\'R42\')"/>' +
            '<rect id="R43" rx="5" ry="5" height="30" width="30" y="165" x="635" onclick="configKeys.setKey(\'R43\')"/>' +
            '<rect id="R44" rx="5" ry="5" height="30" width="30" y="201" x="635" onclick="configKeys.setKey(\'R44\')"/>' +
            '<rect id="R30" rx="5" ry="5" height="30" width="30" y="57" x="671" onclick="configKeys.setKey(\'R30\')"/>' +
            '<rect id="R31" rx="5" ry="5" height="30" width="30" y="93" x="671" onclick="configKeys.setKey(\'R31\')"/>' +
            '<rect id="R32" rx="5" ry="5" height="30" width="30" y="129" x="671" onclick="configKeys.setKey(\'R32\')"/>' +
            '<rect id="R33" rx="5" ry="5" height="30" width="30" y="165" x="671" onclick="configKeys.setKey(\'R33\')"/>' +
            '<rect id="R34" rx="5" ry="5" height="30" width="30" y="201" x="671" onclick="configKeys.setKey(\'R34\')"/>' +
            '<rect id="R20" rx="5" ry="5" height="30" width="30" y="57" x="707" onclick="configKeys.setKey(\'R20\')"/>' +
            '<rect id="R21" rx="5" ry="5" height="30" width="30" y="93" x="707" onclick="configKeys.setKey(\'R21\')"/>' +
            '<rect id="R22" rx="5" ry="5" height="30" width="30" y="129" x="707" onclick="configKeys.setKey(\'R22\')"/>' +
            '<rect id="R23" rx="5" ry="5" height="30" width="30" y="165" x="707" onclick="configKeys.setKey(\'R23\')"/>' +
            '<rect id="R24" rx="5" ry="5" height="30" width="30" y="201" x="707" onclick="configKeys.setKey(\'R24\')"/>' +
            '<rect id="R10" rx="5" ry="5" height="30" width="30" y="57" x="743" onclick="configKeys.setKey(\'R10\')"/>' +
            '<rect id="R11" rx="5" ry="5" height="30" width="30" y="93" x="743" onclick="configKeys.setKey(\'R11\')"/>' +
            '<rect id="R12" rx="5" ry="5" height="30" width="30" y="129" x="743" onclick="configKeys.setKey(\'R12\')"/>' +
            '<rect id="R13" rx="5" ry="5" height="30" width="30" y="165" x="743" onclick="configKeys.setKey(\'R13\')"/>' +
            '<rect id="R14" rx="5" ry="5" height="30" width="30" y="201" x="743" onclick="configKeys.setKey(\'R14\')"/>' +
            '<rect id="R00" rx="5" ry="5" height="30" width="60" y="57" x="779" onclick="configKeys.setKey(\'R00\')"/>' +
            '<rect id="R01" rx="5" ry="5" height="30" width="60" y="93" x="779" onclick="configKeys.setKey(\'R01\')"/>' +
            '<rect id="R02" rx="5" ry="5" height="30" width="60" y="129" x="779" onclick="configKeys.setKey(\'R02\')"/>' +
            '<rect id="R03" rx="5" ry="5" height="30" width="60" y="165" x="779" onclick="configKeys.setKey(\'R03\')"/>' +
            '<rect id="R04" rx="5" ry="5" height="30" width="30" y="201" x="779" onclick="configKeys.setKey(\'R04\')"/>' +
            '<rect id="R80" ry="5" rx="5" transform="matrix(-.92926 .36943 .36943 .92926 0 0)" height="30" width="30" y="373" x="-404" onclick="configKeys.setKey(\'R80\')"/>' +
            '<rect id="R81" ry="5" rx="5" transform="matrix(-.92926 .36943 .36943 .92926 0 0)" height="30" width="30" y="409" x="-404" onclick="configKeys.setKey(\'R81\')"/>' +
            '<rect id="R82" ry="5" rx="5" transform="matrix(-.92926 .36943 .36943 .92926 0 0)" height="30" width="30" y="445" x="-404" onclick="configKeys.setKey(\'R82\')"/>' +
            '<rect id="R70" ry="5" rx="5" transform="matrix(-.92926 .36943 .36943 .92926 0 0)" height="30" width="30" y="373" x="-440" onclick="configKeys.setKey(\'R70\')"/>' +
            '<rect id="R71" ry="5" rx="5" transform="matrix(-.92926 .36943 .36943 .92926 0 0)" height="66" width="30" y="409" x="-440" onclick="configKeys.setKey(\'R71\')"/>' +
            '<rect id="R63" ry="5" rx="5" transform="matrix(-.92926 .36943 .36943 .92926 0 0)" height="66" width="30" y="409" x="-476" onclick="configKeys.setKey(\'R63\')"/>' +
            '</g>' +
            '<path id="path4298" d="m205.58 119.83 15.87-0.0838" stroke-width="1px" fill="none"/>' +
            '<path id="path4298-0" d="m603.51 119.09 15.87-0.0838" stroke-width="1px" fill="none"/>' +
            '</g>' +
            '</svg>',
        "ordering": [
                "R42",
                "L42",
                "R32",
                "L32",
                "R22",
                "L22",
                "R12",
                "L12",
                "R52",
                "L52",
                "R41",
                "L41",
                "R41",
                "R31",
                "L31",
                "R21",
                "L21",
                "R11",
                "L11",
                "R51",
                "L51",
                "R43",
                "L43",
                "R33",
                "L33",
                "R23",
                "L23",
                "R13",
                "L13",
                "R53",
                "L53",
                "R40",
                "L40",
                "R40",
                "R30",
                "L30",
                "R20",
                "L20",
                "R10",
                "L10",
                "R50",
                "L50",
                "R44",
                "L44",
                "R34",
                "L34",
                "R24",
                "L24",
                "R14",
                "L14",
                "R63",
                "L63",
                "R71",
                "L71",
                "R00",
                "L00",
                "R01",
                "L01",
                "R02",
                "L02",
                "R03",
                "L03",
                "R04",
                "L04",
                "R60",
                "L60",
                "R61",
                "L61",
                "R62",
                "L62",
                "R70",
                "L70",
                "R80",
                "L80",
                "R81",
                "L81",
                "R82",
                "L82"
            ],
        "layout": {
            "ergodox-ez default (en_US)": {
                "language": "en_US",
                "mapping": {
                    " ": "L63",
                    ",": "L14",
                    "-": "R00",
                    ".": "R33",
                    "0": "R10",
                    "1": "L10",
                    "2": "L20",
                    "3": "L30",
                    "4": "L40",
                    "5": "L50",
                    "6": "R50",
                    "7": "R40",
                    "8": "R30",
                    "9": "R20",
                    "a": "L12",
                    "b": "L53",
                    "c": "L33",
                    "d": "L32",
                    "e": "L31",
                    "f": "L42",
                    "g": "L52",
                    "h": "R52",
                    "i": "R31",
                    "j": "R42",
                    "k": "R32",
                    "l": "R22",
                    "m": "R43",
                    "n": "R53",
                    "o": "R21",
                    "p": "R11",
                    "q": "L11",
                    "r": "L41",
                    "s": "L22",
                    "t": "L51",
                    "u": "R41",
                    "v": "L43",
                    "w": "L21",
                    "x": "L23",
                    "z": "L13",
                    "y": "R51"
                }
            }
        }
    }
}

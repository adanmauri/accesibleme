var
	document = window.document,
	version = "0.3.0";

accesibleme = {};

/* accesibleme Query */
/* ================= */
accesibleme.query = function (selector, context) {
    var proto = Object.create(accesiblemeQueryPrototype);
    proto.init(selector, context);
    return proto;
};

accesiblemeQueryPrototype = {
    init: function(selector, context) {
        var arr, elem;
        var context = context || document;

	    if ( !selector ) {
		    return;
	    }

        if ( typeof selector === "string" ) {
            if (selector[0] === "#") {
                arr = [context.getElementById(selector.substr(1))];
            } else if (selector[0] === ".") {
                arr = [].slice.call(context.getElementsByClassName(selector.substr(1)));
            } else {
                arr = [].slice.call(context.getElementsByTagName(selector));
            }
        } else if ( selector.nodeType ) {
            arr = [selector];
        }
        
        if (arr.length > 0) {
            for (i in arr) {
                this[i] = arr[i];
            }
            this.length = arr.length;

            this.selector = selector;
            this.context = context;
            this.accesibleme = version;
            this.success = true;
        }
    },
    css: function(name, value) {
        if ( (!name) || (this.success === undefined) ) {
	        return;
        }
        if (value === undefined) {
            var style;
            if (this[0].currentStyle) {
                if (name === "border") {
                    style = this[0].currentStyle.getAttribute("border-width");
                    style += " "+this[0].currentStyle.getAttribute("border-style");
                    style += " "+accesibleme.colors(this[0].currentStyle.getAttribute("border-color")).toRgb();
                } else
                    style = this[0].currentStyle.getAttribute(name);
            } else if (window.getComputedStyle(this[0], null)) {
                style = window.getComputedStyle(this[0], null).getPropertyValue(name);
            }

            if (name.substr(name.length - 5) === "color") {
                console.log(accesibleme.colors(style));
                style = accesibleme.colors(style).toRgbAsString(true);          
            }

            return style;
        } else {
            var str = "this[i].style.";
            var chr="";
            var i=0;
            while (i < name.length){
                if (name[i] == "-") {
                    i++;
                    name = name.substring(0, i) + name[i].toUpperCase() + name.substring(i + 1);
                }
                chr += name[i];
                i++;
            }
            name = chr;
            value = (value === null)?"null":'"'+value+'"';
            for (var i=0; i < this.length; i++) {
                eval(str+name+'='+value);
            }
            return value;
        }
    }
}


/* accesibleme Colors */
/* ================== */

accesibleme.colors = function (input)
{
    var proto = Object.create(accesiblemeColorsPrototype);
    if (input) proto.init(input);
    return proto;
};
accesiblemeColorsPrototype =
{
    version: version,

    color:  undefined,
    format: undefined,
    array:  undefined,
    alpha:  false,

    init: function (input)
    {
        this.color = input;
        if (typeof input == "string") {
            this.stringToArray();
        } else if (typeof input == "object") {
            this.objectToArray();
        }
    },
    clone: function ()
    {
        return accesibleme.colors(this.color);
    },

    /* PUBLIC */
    stringDetectFormat: function(input) {
        var res,
            input = this.color || input,
            op = input.indexOf('('),
            ep = input.indexOf(')');
        
        if (!input || typeof input != "string" || input == "" || input.length < 3)
            res = false;
        else if (input[0] === '#' || !isNaN(parseInt(input[0]+input[1], 16)) )
            res = "hex"
        else if (op !== -1 && ep + 1 === input.length)
            res = input.substr(0, op);
        else
            res = "name";
        
        if (this.color)
            this.format = res;
        return res;
    },
    objectDetectFormat: function(input) {
        return input.format;
    },
    stringToArray: function(input, format) {
        var res,
            input = this.color || input,
            format = this.format || format || this.stringDetectFormat(input),
            trimLeft = /^[\s,#]+/, 
            trimRight = /\s+$/;
            
        input = input.replace(trimLeft,'').replace(trimRight,'').replace(/ /g,'').toLowerCase();

        switch (format) {
            case "name": res = this.stringNameToArray(input); break;
            case "hex":  res = this.stringHexToArray(input);  break;
            case "rgb":  res = this.stringRgbToArray(input);  break;
                break;
            case "rgba": res = this.stringRgbToArray(input);  
                         this.alpha = true;  
                break;
            case "hsl":  res = this.stringHslToArray(input);  break;
                break;
            case "hsla": res = this.stringHslToArray(input);  break;
                         this.alpha = true;  
                break;
            default:     res = false;
        }
        
        if (this.color)
            this.array = res;
        return res;       
    },
    objectToArray: function(input, format) {
        var res,
            input = this.color || input,
            format = this.format || format || this.objectDetectFormat(input);
            
        switch (format) {
            case "hex":  res = this.objectHexToArray(input);  break;
            case "rgb":  res = this.objectRgbToArray(input);  break;
                break;
            case "rgba": res = this.objectRgbToArray(input);  
                         this.alpha = true;  
                break;
            case "hsl":  res = this.objectHslToArray(input);  break;
                break;
            case "hsla": res = this.objectHslToArray(input);  break;
                         this.alpha = true;  
                break;
            default:     res = false;
        }

        if (this.color)
            this.array = res;
        return res;
    },

    /* Getters / Setters */
    getVersion: function() {
        return this.version;
    },
    getColor: function() {
        return this.color;
    },
    getFormat: function() {
        return this.format;
    },
    getColorArray: function() {
        return this.array;
    },

    /* Getters calculations */
    getLuminance: function(color) {
        var c = color || this.array.slice();
        if (!color)
            for (var i=0; i<3; i++) c[0]/= 255;
        
        return ( (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]) );
    },
    getRelativeLuminance: function(color) {
        // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var c = color || this.array.slice();
		
		for (var i=0; i<3; i++) {			
			c[i]/= 255;
            if (c[i] <= 0.03928) {
	            c[i] = c[i] / 12.92;	
            } else {
	            c[i] = Math.pow( ((c[i]+0.055)/1.055), 2.4 );
            }
		}

		return this.getLuminance(c);
    },
    getContrastTo: function(color) {
        var ratio = 1,
	        l1 = this.getRelativeLuminance(),
	        l2 = color.getRelativeLuminance();
	    
        if (l1 >= l2) {
		    ratio = (l1 + .05) / (l2 + .05);
	    } else {
		    ratio = (l2 + .05) / (l1 + .05);
	    }
	    return Math.round(ratio * 100) / 100;
	},
    getInverse: function () {
		return new accesibleme.colors({
			r:255 - this.array[0],
			g:255 - this.array[1],
			b:255 - this.array[2],
			a:this.alpha,
            format: "rgb"
		});
	},

    /* Convertions */
    toHexAsObject: function (alpha) {
        var c = this.array.slice();
        if (alpha == undefined)
            alpha = this.alpha || false;
        if (c) {
            for (i in c) {
                if (i == 3)
                    c[i] = Math.floor(c[i] * 255);
                c[i] = (c[i]).toString(16);
                c[i] = (c[i].length < 2)?"0"+c[i]:c[i];
            }
            if (alpha)
                return {hr: c[0], hg:c[1], hb:c[2], ha:c[3]};
            else
                return {hr: c[0], hg:c[1], hb:c[2]};
        }
        return undefined;
    },
    toRgbAsObject: function (alpha) {
        var c = this.array.slice();
        if (alpha == undefined)
            alpha = this.alpha || false;
        if (c) {
            if (alpha)
                return {r: c[0], g:c[1], b:c[2], a:c[3]};
            else
                return {r: c[0], g:c[1], b:c[2]};
        }
        return undefined;
    },
    toHslAsObject: function (alpha) {
        var c = this.array.slice(),
            res,
            min,
            max,
            delta;

        if (alpha == undefined)
            alpha = this.alpha || false;
        if (c) {
            c[0]/= 255;
            c[1]/= 255;
            c[2]/= 255;

            min = Math.min(c[0], c[1], c[2]);
            max = Math.max(c[0], c[1], c[2]);
            delta = max - min;
            res = [0, 0, 0];

            if (max == min)
                c[0] = 0;
            else if (c[0] == max)
                c[0] = (c[1] - c[2]) / delta;
            else if (c[1] == max)
                c[0] = 2 + (c[2] - c[0]) / delta;
            else if (c[2] == max)
                c[0] = 4 + (c[0] - c[1])/ delta;

            c[0] = Math.round(Math.min(c[0] * 60, 360));

            if (c[0] < 0)
                c[0] += 360;

            c[2] = (min + max) / 2 * 100;

            if (max == min)
                c[1] = 0;
            else if (c[2] <= 50)
                c[1] = delta / (max + min);
            else
                c[1] = delta / (2 - max - min);

            c[1]*= 100;

            if (alpha)
                return {h: c[0], s:c[1], l:c[2], a:c[3]};
            else
                return {h: c[0], s:c[1], l:c[2]};

        }
        return undefined;
    },
    
    toHexAsString: function (alpha)
    {
        var c = this.toHexAsObject(alpha);
        if (c) {
            res = "#"+c.hr+c.hg+c.hb;
            if (c.ha)
                res+=c.ha;
            return res;
        }
        return undefined;
    },
    toRgbAsString: function (alpha)
    {
        var c = this.toRgbAsObject(alpha);
        if (c) {
            res = "rgb";
            if (c.a) res+="a";
            res+= "("+c.r+", "+c.g+", "+c.b;
            if (c.a) res+=", "+c.a;
            res+=")";
            return res;
        }
        return undefined;
    },
    toHslAsString: function (alpha)
    {
        var c = this.toHslAsObject(alpha);
        if (c) {
            res = "hsl";
            if (c.a) res+="a";
            res+= "("+c.h+", "+c.s+"%, "+c.l+"%";
            if (c.a) res+=", "+c.a;
            res+=")";
            return res;
        }
        return undefined;
    },  

    /* PRIVATE */
    /* Name */
    stringNameToArray: function(input) {
        input = this.colorNames(input);
        input[3] = 1;
        return input;
    },

    /* Hex */
    stringHexToObject: function(input) {
        var match = {
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex4: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        }
        if (input[0] === '#')
            input = input.substr(1, input.length);

        if (input.length <= 4) {
            if (input.length == 3) {
                match = match.hex3.exec(input);
                match[4] = "ff";
            } else {
                match = match.hex4.exec(input);
                match[4]+= match[4];
                this.alpha = true;  
            }
            match[1]+= match[1];
            match[2]+= match[2];
            match[3]+= match[3];
        } else if (input.length == 6) {
            match = match.hex6.exec(input);
            match[4] = "FF";
        } else if (input.length == 8) {
            match = match.hex8.exec(input);
            this.alpha = true;  
        } else
            match = false;

        if (!match)
            return match;
        return {hr: match[1],
                hg: match[2],
                hb: match[3],
                ha: match[4]}
    },
    objectHexToArray: function(input) {
        if (!input.ha) input.ha = "ff";
        return this.decToArray([
            parseInt(input.hr, 16),
            parseInt(input.hg, 16),
            parseInt(input.hb, 16),
            (parseInt(input.ha, 16)/255).toFixed(2)
        ]);
    },
    stringHexToArray: function(input) {
        return this.objectHexToArray(this.stringHexToObject(input));
    },


    /* Rgb */
    stringRgbToObject: function (input) {
        input = this.parseStringParameters(input);
        for (var i=0; i < input.length - 1; i++) {
            if ( (input[i][input[i].length-1] == "%") ) {
                input[i] = parseFloat(input[i])/100*255;
                input[i] = Math.floor(input[i])
            }
        }
        if (input.length < 4) {
            input[3] = 1;
        } else {
            this.alpha = true; 
        }
        return {r: input[0],
                g: input[1],
                b: input[2],
                a: input[3]}
    },
    objectRgbToArray: function (input) {
        if (!input.a) input.a = 1;
        return this.decToArray([
            input.r,
            input.g,
            input.b,
            input.a
        ]);
    },
    stringRgbToArray: function (input) {
        return this.objectRgbToArray(this.stringRgbToObject(input));
    },

    /* Hsl */
    stringHslToObject: function (input)
    {
        input = this.parseStringParameters(input);
        input[0] = parseInt(input[0]);
        input[1] = parseFloat(input[1])/100;
        input[2] = parseFloat(input[2])/100;
        if (input[3])
            this.alpha = true;
        input[3] = input[3] || 1;
        
        return {h: input[0],
                s: input[1],
                l: input[2],
                a: input[3]}
    },
    objectHslToArray: function (input)
    {
        var rgb;
        if (!input.a) input.a = 1;
        if (input.s == 0)
        {
            rgb = [input.l, input.l, input.l, input.a]; // achromatic
        }
        else
        {
            function hueToRgb(m1, m2, hue)
            {
                var v;
                if (hue < 0) hue += 1;
                else if (hue > 1) hue -= 1;

                if (6 * hue < 1) v = m1 + (m2 - m1) * hue * 6;
                else if (2 * hue < 1) v = m2;
                else if (3 * hue < 2) v = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
                else
                v = m1;
                return 255 * v;
            }
            var m1, m2, hue;
            m2 = (input.l <= 0.5) ? (input.l * (input.s + 1)) : (input.l + input.s - input.l * input.s);
            m1 = input.l * 2 - m2;
            hue = input.h / 360;
            rgb = [hueToRgb(m1, m2, hue + 1 / 3),
                   hueToRgb(m1, m2, hue),
                   hueToRgb(m1, m2, hue - 1 / 3),
                   input.a];
        }
        return this.decToArray(rgb);
    },
    stringHslToArray: function (input) {
        return this.objectHslToArray(this.stringHslToObject(input));
    },

    parseStringParameters: function(input) {
        var op = input.indexOf('('), ep = input.indexOf(')');
        return input.substr(op+1,ep -(op + 1)).split(',');
    },
    decToArray: function (dec) {
        if (dec)
            return [Math.floor(dec[0]),
                    Math.floor(dec[1]),
                    Math.floor(dec[2]),
                    parseFloat(dec[3])];
        return false;
    },

    colorNames: function (name) {
        var colors = {"aliceblue":[240,248,255],"antiquewhite":[250,235,215],"aqua":[0,255,255],"aquamarine":[127,255,212],"azure":[240,255,255],"beige":[245,245,220],"bisque":[255,228,196],"black":[0,0,0],"blanchedalmond":[255,235,205],"blue":[0,0,255],"blueviolet":[138,43,226],"brown":[165,42,42],"burlywood":[222,184,135],"cadetblue":[95,158,160],"chartreuse":[127,255,0],"chocolate":[210,105,30],"coral":[255,127,80],"cornflowerblue":[100,149,237],"cornsilk":[255,248,220],"crimson":[220,20,60],"cyan":[0,255,255],"darkblue":[0,0,139],"darkcyan":[0,139,139],"darkgoldenrod":[184,134,11],"darkgray":[169,169,169],"darkgreen":[0,100,0],"darkkhaki":[189,183,107],"darkmagenta":[139,0,139],"darkolivegreen":[85,107,47],"darkorange":[255,140,0],"darkorchid":[153,50,204],"darkred":[139,0,0],"darksalmon":[233,150,122],"darkseagreen":[143,188,143],"darkslateblue":[72,61,139],"darkslategray":[47,79,79],"darkturquoise":[0,206,209],"darkviolet":[148,0,211],"deeppink":[255,20,147],"deepskyblue":[0,191,255],"dimgray":[105,105,105],"dodgerblue":[30,144,255],"firebrick":[178,34,34],"floralwhite":[255,250,240],"forestgreen":[34,139,34],"fuchsia":[255,0,255],"gainsboro":[220,220,220],"ghostwhite":[248,248,255],"gold":[255,215,0],"goldenrod":[218,165,32],"gray":[128,128,128],"green":[0,128,0],"greenyellow":[173,255,47],"honeydew":[240,255,240],"hotpink":[255,105,180],"indianred ":[205,92,92],"indigo":[75,0,130],"ivory":[255,255,240],"khaki":[240,230,140],"lavender":[230,230,250],"lavenderblush":[255,240,245],"lawngreen":[124,252,0],"lemonchiffon":[255,250,205],"lightblue":[173,216,230],"lightcoral":[240,128,128],"lightcyan":[224,255,255],"lightgoldenrodyellow":[250,250,210],"lightgrey":[211,211,211],"lightgreen":[144,238,144],"lightpink":[255,182,193],"lightsalmon":[255,160,122],"lightseagreen":[32,178,170],"lightskyblue":[135,206,250],"lightslategray":[119,136,153],"lightsteelblue":[176,196,222],"lightyellow":[255,255,224],"lime":[0,255,0],"limegreen":[50,205,50],"linen":[250,240,230],"magenta":[255,0,255],"maroon":[128,0,0],"mediumaquamarine":[102,205,170],"mediumblue":[0,0,205],"mediumorchid":[186,85,211],"mediumpurple":[147,112,216],"mediumseagreen":[60,179,113],"mediumslateblue":[123,104,238],"mediumspringgreen":[0,250,154],"mediumturquoise":[72,209,204],"mediumvioletred":[199,21,133],"midnightblue":[25,25,112],"mintcream":[245,255,250],"mistyrose":[255,228,225],"moccasin":[255,228,181],"navajowhite":[255,222,173],"navy":[0,0,128],"oldlace":[253,245,230],"olive":[128,128,0],"olivedrab":[107,142,35],"orange":[255,165,0],"orangered":[255,69,0],"orchid":[218,112,214],"palegoldenrod":[238,232,170],"palegreen":[152,251,152],"paleturquoise":[175,238,238],"palevioletred":[216,112,147],"papayawhip":[255,239,213],"peachpuff":[255,218,185],"peru":[205,133,63],"pink":[255,192,203],"plum":[221,160,221],"powderblue":[176,224,230],"purple":[128,0,128],"red":[255,0,0],"rosybrown":[188,143,143],"royalblue":[65,105,225],"saddlebrown":[139,69,19],"salmon":[250,128,114],"sandybrown":[244,164,96],"seagreen":[46,139,87],"seashell":[255,245,238],"sienna":[160,82,45],"silver":[192,192,192],"skyblue":[135,206,235],"slateblue":[106,90,205],"slategray":[112,128,144],"snow":[255,250,250],"springgreen":[0,255,127],"steelblue":[70,130,180],"tan":[210,180,140],"teal":[0,128,128],"thistle":[216,191,216],"tomato":[255,99,71],"turquoise":[64,224,208],"violet":[238,130,238],"wheat":[245,222,179],"white":[255,255,255],"whitesmoke":[245,245,245],"yellow":[255,255,0],"yellowgreen":[154,205,50]};

        if (colors[name])
            return colors[name];
        return false;
    }

}




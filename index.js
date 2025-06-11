var p5Utils;
(function (p5Utils) {
    class CanvasUtils {
        constructor() {
            throw new TypeError("Cannot make instance of CanvasUtils");
        }
        /**
         * Calculates the largest possible size of an element given an aspect ratio and max dimensions.
         * @param aspectRatio The aspect ratio (width / height)
         * @param maxX The maximum allowed width (leave null if none, but then maxY is required)
         * @param maxY The maximum allowed height (leave null if none, but then maxX is required)
         */
        static aspectToSize(aspectRatio, maxX, maxY) {
            if (NumberUtils.isNullish(maxX) && NumberUtils.isNullish(maxY))
                throw new Error("maxX and maxY cannot both be null");
            if (!NumberUtils.isNullish(maxX) && !NumberUtils.isNullish(maxY)) {
                let h = maxY;
                if (h * aspectRatio > maxX)
                    h = maxX / aspectRatio;
                return new Vector2(h * aspectRatio, h);
            }
            else if (!NumberUtils.isNullish(maxX))
                return new Vector2(maxX, maxX / aspectRatio);
            else
                return new Vector2(maxY * aspectRatio, maxY);
        }
    }
    p5Utils.CanvasUtils = CanvasUtils;
    class DrawUtils {
        constructor() {
            throw new TypeError("Cannot make instance of DrawUtils");
        }
        /**
         * Draws a line using a point and sizes, rather than two points
         * @param x X-position of line starting point
         * @param y Y-position of line starting point
         * @param w The horizontal distance of the line
         * @param h The vertical distance of the line
         */
        static line(x, y, w, h, graphics = window) {
            graphics.line(x, y, x + w, y + h);
        }
        static text(font, textString, x, y, size, justifyX = CENTER, justifyY = CENTER, rotation = 0, graphics = window) {
            if (size === undefined || size === null)
                size = graphics.textSize();
            graphics.push();
            graphics.textFont(font);
            graphics.textSize(size);
            graphics.textAlign(justifyX, justifyY);
            graphics.translate(x /*  - justifyX * DrawUtils.textWidth(textString, font, size, NORMAL) */, y /*  - justifyY * DrawUtils.textHeight(textString, font, size, NORMAL) */);
            graphics.rotate(rotation);
            graphics.text(textString, 0, 0);
            graphics.pop();
        }
        static textWidth(text, font, size, style) {
            push();
            textStyle(style);
            textSize(size);
            textFont(font);
            let lines = DrawUtils.textLines(text);
            let widths = [];
            for (let line of lines) {
                widths.push(textWidth(line));
            }
            pop();
            return Math.max(...widths);
        }
        /**
         * Gets each individual line of the text, width text wrapping taken into account.
         * @returns An array containing each line of text
         */
        static textLines(text, w) {
            let lines = text.split("\n");
            let nlines = [];
            if (w === null || w === undefined)
                return lines;
            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                let line = '';
                let words = lines[lineIndex].split(' ');
                for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                    let testLine = ''.concat(line + words[wordIndex]) + ' ';
                    let testWidth = textWidth(testLine);
                    if (testWidth > w && line.length > 0) {
                        nlines.push(line);
                        line = ''.concat(words[wordIndex]) + ' ';
                    }
                    else {
                        line = testLine;
                    }
                }
                nlines.push(line);
            }
            return nlines;
        }
        static textHeight(text, font, size, style) {
            push();
            textStyle(style);
            textSize(size);
            textFont(font);
            let h = DrawUtils.textLines(text).length * textLeading();
            pop();
            return h;
        }
    }
    p5Utils.DrawUtils = DrawUtils;
    class Vector2 {
        x;
        y;
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new Vector2(this.x, this.y);
        }
        copy(destination) {
            destination.x = this.x;
            destination.y = this.y;
        }
        /**
         * Creates a new `Vector2` from a given angle (in radians) and magnitude.
         * @param angle Angle (radians)
         * @param magnitude
         */
        static fromAngle(angle, magnitude) {
            return new Vector2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
        }
        /**
         * Creates a new `Vector2` from a given angle (in degrees) and magnitude.
         * @param angle Angle (degrees)
         * @param magnitude
         */
        static fromAngleDegrees(angle, magnitude) {
            return new Vector2(magnitude * Math.cos(angle * Math.PI / 180), magnitude * Math.sin(angle * Math.PI / 180));
        }
        /**
         * Creates a new `Vector2` with the value <0, 0>
         */
        static get zero() {
            return new Vector2(0, 0);
        }
        /**
         * Returns a vector with the mouse coordinates. If the sketch has not been set up yet, returns undefined.
         */
        static getMousePositionVector() {
            try {
                return new Vector2(mouseX, mouseY);
            }
            catch (err) {
                return undefined;
            }
        }
        withX(x) {
            return new Vector2(x, this.y);
        }
        withY(y) {
            return new Vector2(this.x, y);
        }
        add(other) {
            return new Vector2(this.x + other.x, this.y + other.y);
        }
        sub(other) {
            return new Vector2(this.x - other.x, this.y - other.y);
        }
        mult(value) {
            if (typeof value == "number")
                return new Vector2(this.x * value, this.y * value);
            else
                return new Vector2(this.x * value.x, this.y * value.y);
        }
        div(value) {
            if (typeof value == "number")
                return new Vector2(this.x / value, this.y / value);
            else
                return new Vector2(this.x / value.x, this.y / value.y);
        }
        mod(value) {
            if (typeof value == "number")
                return new Vector2(this.x % value, this.y % value);
            else
                return new Vector2(this.x % value.x, this.y % value.y);
        }
        dot(other) {
            return this.x * other.x + this.y * other.y;
        }
        get magnitude() {
            return Math.sqrt(this.magSq);
        }
        set magnitude(value) {
            let newVector = Vector2.fromAngle(this.angle, value);
            this.x = newVector.x;
            this.y = newVector.y;
        }
        get magSq() {
            return this.x ** 2 + this.y ** 2;
        }
        get angle() {
            return Math.atan2(this.y, this.x);
        }
        set angle(value) {
            let newVector = Vector2.fromAngle(value, this.magnitude);
            this.x = newVector.x;
            this.y = newVector.y;
        }
        normalize() {
            if (this.x == 0 && this.y == 0)
                return new Vector2(0, 0);
            return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
        }
        lerp(other, amt) {
            return new Vector2((other.x - this.x) * amt + this.x, (other.y - this.y) * amt + this.y);
        }
        /**
         * @param centerPoint
         * @param angle Rotation in radians
         */
        rotate(centerPoint, angle) {
            return new Vector2((this.x - centerPoint.x) * Math.cos(angle) - (this.y - centerPoint.y) * Math.sin(angle) + centerPoint.x, (this.x - centerPoint.x) * Math.sin(angle) + (this.y - centerPoint.y) * Math.cos(angle) + centerPoint.y);
        }
        /**
         * @param {Vector2} other
         * @returns {boolean}
         */
        equals(other) {
            if (this.x == other.x && this.y == other.y)
                return true;
            return false;
        }
        /**
         * Converts the vector to an array containing the x and y component.
         */
        toArray() {
            return [this.x, this.y];
        }
        toString() {
            return `<${this.x}, ${this.y}>`;
        }
    }
    p5Utils.Vector2 = Vector2;
    class NumberUtils {
        constructor() {
            throw new TypeError("Cannot make instance of NumberUtils");
        }
        static isNullish(n) {
            return !n && n !== 0;
        }
    }
    p5Utils.NumberUtils = NumberUtils;
    let Easings;
    (function (Easings) {
        class Ease {
            constructor($in, $out, $inout) {
                this.in = $in;
                this.out = $out || Ease.invert($in);
                this.inout = $inout || Ease.follow(this.in, this.out);
            }
            in;
            out;
            inout;
            static invert(fn) {
                return t => 1 - fn(1 - t);
            }
            static follow(first, second) {
                return t => t <= 0.5 ? 0.5 * first(2 * t) : 0.5 + 0.5 * second(2 * (t - 0.5));
            }
        }
        Easings.Ease = Ease;
        Easings.linear = new Ease(t => t);
        Easings.quad = new Ease(t => t * t);
        Easings.cubic = new Ease(t => t * t * t);
        Easings.quart = new Ease(t => t * t * t * t);
        Easings.quint = new Ease(t => t * t * t * t * t);
        Easings.elastic = new Ease(t => t == 0 ? 0 : (0.04 - 0.04 / t) * Math.sin(25 * t) + 1);
        Easings.sin = new Ease(t => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2));
        Easings.back = new Ease(t => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return c3 * t * t * t - c1 * t * t;
        });
    })(Easings = p5Utils.Easings || (p5Utils.Easings = {}));
})(p5Utils || (p5Utils = {}));
var p5Utils;
(function (p5Utils) {
    var Ext;
    (function (Ext) {
        let FancyText;
        (function (FancyText) {
            function create(segments) {
                return segments.map(v => new FancyText.TextSegment(v));
            }
            FancyText.create = create;
            function draw(graphics, segments, position, textSize, font, justify, alpha = 255) {
                graphics.push();
                // adjust for justify
                position = position.sub(justify.mult(new p5Utils.Vector2(getWidth(segments, textSize, font), textSize)));
                for (const segment of segments) {
                    segment.draw(graphics, position, textSize, font, p5Utils.Vector2.zero, alpha);
                    position = position.withX(position.x + segment.getWidth(textSize, font));
                }
                graphics.pop();
            }
            FancyText.draw = draw;
            function getWidth(segments, textSize, font) {
                let w = 0;
                for (const segment of segments) {
                    w += segment.getWidth(textSize, font);
                }
                return w;
            }
            FancyText.getWidth = getWidth;
            FancyText.ScriptScale = 0.5;
            class TextProperties {
                color = 0;
                script = TextProperties.Script.Normal;
                style = NORMAL;
                constructor(props) {
                    for (const key in props) {
                        if (Object.prototype.hasOwnProperty.call(props, key)) {
                            this[key] = props[key];
                        }
                    }
                }
            }
            FancyText.TextProperties = TextProperties;
            (function (TextProperties) {
                let Script;
                (function (Script) {
                    Script[Script["Normal"] = 0] = "Normal";
                    Script[Script["Subscript"] = 1] = "Subscript";
                    Script[Script["Superscript"] = 2] = "Superscript";
                })(Script = TextProperties.Script || (TextProperties.Script = {}));
            })(TextProperties = FancyText.TextProperties || (FancyText.TextProperties = {}));
            class TextSegment {
                text;
                properties;
                constructor(textOrData, properties) {
                    if (typeof textOrData == "string") {
                        this.text = textOrData;
                        if (!properties)
                            properties = {};
                        this.properties = !(properties instanceof TextProperties) ?
                            new TextProperties(properties) : properties;
                    }
                    else {
                        this.text = textOrData.text;
                        if (!textOrData.properties)
                            textOrData.properties = {};
                        this.properties = !(textOrData.properties instanceof TextProperties) ?
                            new TextProperties(textOrData.properties) : textOrData.properties;
                    }
                }
                getWidth(textSize, font) {
                    let sizeFactor = this.properties.script != TextProperties.Script.Normal
                        ? FancyText.ScriptScale : 1;
                    return p5Utils.DrawUtils.textWidth(this.text, font, textSize * sizeFactor, this.properties.style);
                }
                draw(graphics, position, textSize, font, justify, alpha = 255) {
                    if (!justify)
                        justify = p5Utils.Vector2.zero;
                    graphics.push();
                    graphics.textSize(textSize);
                    graphics.textAlign(LEFT, TOP);
                    graphics.textFont(font);
                    graphics.textStyle(this.properties.style);
                    //@ts-expect-error
                    let col = color(this.properties.color).levels;
                    if (alpha < 255)
                        col[3] = alpha;
                    graphics.fill(col);
                    graphics.strokeWeight(0);
                    let scale = this.properties.script != TextProperties.Script.Normal
                        ? FancyText.ScriptScale : 1;
                    let yOffset = 0;
                    if (this.properties.script == TextProperties.Script.Subscript)
                        yOffset = 0.6 * textSize;
                    else if (this.properties.script == TextProperties.Script.Superscript)
                        yOffset = -0.1 * textSize;
                    graphics.translate(position.x - justify.x * this.getWidth(textSize, font), position.y - justify.y * textSize + yOffset);
                    graphics.scale(scale);
                    graphics.text(this.text, 0, 0);
                    graphics.pop();
                }
            }
            FancyText.TextSegment = TextSegment;
        })(FancyText = Ext.FancyText || (Ext.FancyText = {}));
        let FancyTextAnimations;
        (function (FancyTextAnimations) {
            class AnimTextProperties extends FancyText.TextProperties {
                animID;
                constructor(props) {
                    super(props);
                    if (!props)
                        return;
                    if (typeof props.animID == "string")
                        props.animID = [props.animID];
                    this.animID = props.animID;
                }
            }
            FancyTextAnimations.AnimTextProperties = AnimTextProperties;
            class AnimTextSegment extends FancyText.TextSegment {
                constructor(textOrData, properties) {
                    if (typeof textOrData == "string") {
                        if (properties instanceof AnimTextProperties)
                            super(textOrData, properties);
                        else
                            super(textOrData, new AnimTextProperties(properties));
                    }
                    else {
                        if (textOrData.properties && !(textOrData.properties instanceof AnimTextProperties))
                            textOrData.properties = new AnimTextProperties(textOrData.properties);
                        super(textOrData);
                    }
                }
            }
            FancyTextAnimations.AnimTextSegment = AnimTextSegment;
            function create(segments) {
                return segments.map(v => new AnimTextSegment(v));
            }
            FancyTextAnimations.create = create;
            /**
             *
             * @param graphics
             * @param lines
             * @param position
             * @param textSize
             * @param font
             * @param t The animation progress. Each 1.00 represents one line finished.
             * @param justify
             */
            function draw(graphics, lines, position, textSize, font, t, justify) {
                // for the textLeading
                graphics.push();
                graphics.textFont(font);
                graphics.textSize(textSize);
                const leading = graphics.textLeading();
                graphics.pop();
                // this will be determined when that line is drawn
                let animationStartPos = {};
                let animationEndPos = {};
                if (t >= 1 && t < lines.length) {
                    let movingIndex = Math.floor(t);
                    // adjust for justify
                    let pos = position.sub(justify.mult(new p5Utils.Vector2(FancyText.getWidth(lines[movingIndex], textSize, font), textSize)));
                    pos.y += movingIndex * leading;
                    /**
                     * [First segment, left x-coord of first segment, right x-coord of last segment]
                     */
                    let positions = {};
                    for (const segment of lines[movingIndex]) {
                        let ids = segment.properties.animID;
                        let width = segment.getWidth(textSize, font);
                        if (ids)
                            for (const id of ids)
                                (positions[id] ??= [segment, pos.x, 0])[2] = pos.x + width;
                        pos = pos.withX(pos.x + width);
                    }
                    for (const id in positions) {
                        if (Object.prototype.hasOwnProperty.call(positions, id)) {
                            const animGroup = positions[id];
                            // Find the center of the segments: avg of left and rightmost points
                            animationEndPos[id] = [animGroup[0], new p5Utils.Vector2((animGroup[1] + animGroup[2]) / 2, pos.y)];
                        }
                    }
                }
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // If this line is already fully animated
                    if (t >= i + 1) {
                        // adjust for justify
                        let pos = position.sub(justify.mult(new p5Utils.Vector2(FancyText.getWidth(line, textSize, font), textSize)));
                        for (const segment of line) {
                            segment.draw(graphics, pos, textSize, font, p5Utils.Vector2.zero);
                            let ids = segment.properties.animID;
                            let width = segment.getWidth(textSize, font);
                            // Only add to animationStartPos if this is the last fully animated line
                            if (ids && t < i + 2)
                                for (const id of ids) {
                                    (animationStartPos[id] ??= { segments: [], centerX: 0 }).segments.push([segment, pos]);
                                    // For now, store rightmost point in centerX
                                    animationStartPos[id].centerX = pos.x + width;
                                }
                            pos = pos.withX(pos.x + width);
                        }
                        // Determine the center for all animation groups
                        if (t < i + 2) {
                            for (const id in animationStartPos) {
                                if (Object.prototype.hasOwnProperty.call(animationStartPos, id)) {
                                    const group = animationStartPos[id];
                                    // Find the center of the segments: avg of left and rightmost points
                                    group.centerX = (group.segments[0][1].x + group.centerX) / 2;
                                }
                            }
                        }
                    }
                    else if (t >= i) {
                        // adjust for justify
                        let pos = position.sub(justify.mult(new p5Utils.Vector2(FancyText.getWidth(line, textSize, font), textSize)));
                        for (const segment of line) {
                            let ids = segment.properties.animID;
                            // There will be nothing to animate from if this is the first line
                            if (ids && i > 0) {
                                for (const id of ids)
                                    if (animationStartPos[id]) {
                                        const endPos = animationEndPos[id][1];
                                        const midX = animationStartPos[id].centerX;
                                        let midPos = new p5Utils.Vector2(midX, pos.y - leading);
                                        let easedPos = midPos.lerp(endPos, p5Utils.Easings.sin.inout(t - i));
                                        // Only draw previous ones once
                                        if (animationEndPos[id][0] == segment) {
                                            for (const prev of animationStartPos[id].segments) {
                                                let offset = prev[1].sub(midPos);
                                                prev[0].draw(graphics, easedPos.add(offset), textSize, font, p5Utils.Vector2.zero, 255 * (1 - p5Utils.Easings.quint.inout(t - i)));
                                            }
                                        }
                                        /* let easedPos = animationStartPos[id][0][1].lerp(pos, Easings.sin.inout(t - i));
        
                                        animationStartPos[id][0].draw(
                                            graphics, easedPos, textSize, font, Vector2.zero, 255 * (1 - Easings.quint.inout(t - i))); */
                                        let offset = pos.sub(endPos);
                                        segment.draw(graphics, easedPos.add(offset), textSize, font, p5Utils.Vector2.zero, 255 * p5Utils.Easings.quint.inout(t - i));
                                    }
                            }
                            else {
                                segment.draw(graphics, pos, textSize, font, p5Utils.Vector2.zero, 255 * p5Utils.Easings.quint.inout(t - i));
                            }
                            pos = pos.withX(pos.x + segment.getWidth(textSize, font));
                        }
                    }
                    position = position.withY(position.y + leading);
                }
            }
            FancyTextAnimations.draw = draw;
        })(FancyTextAnimations = Ext.FancyTextAnimations || (Ext.FancyTextAnimations = {}));
    })(Ext = p5Utils.Ext || (p5Utils.Ext = {}));
})(p5Utils || (p5Utils = {}));

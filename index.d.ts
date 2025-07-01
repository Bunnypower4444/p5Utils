type Renderer = typeof globalThis;
type Graphics = typeof globalThis;
type RenderTarget = Graphics | Renderer;
declare const WEBGL2: string;
type RendererType = typeof P2D | typeof WEBGL | typeof WEBGL2;
type TextStyle = typeof NORMAL | typeof BOLD | typeof ITALIC | typeof BOLDITALIC;
type TextAlignHoriz = typeof LEFT | typeof CENTER | typeof RIGHT;
type TextAlignVert = typeof TOP | typeof CENTER | typeof BOTTOM | typeof BASELINE;
type ColorLike = number | string | number[];
declare function createCanvas(w: number, h: number, canvas: HTMLCanvasElement): Renderer;
declare function createCanvas(w: number, h: number, renderer: RendererType, canvas: HTMLCanvasElement): Renderer;
declare function fill(color: ColorLike): void;
declare function stroke(color: ColorLike): void;
declare namespace p5Utils {
    class CanvasUtils {
        private constructor();
        /**
         * Calculates the largest possible size of an element given an aspect ratio and max dimensions.
         * @param aspectRatio The aspect ratio (width / height)
         * @param maxX The maximum allowed width (leave null if none, but then maxY is required)
         * @param maxY The maximum allowed height (leave null if none, but then maxX is required)
         */
        static aspectToSize(aspectRatio: number, maxX?: number, maxY?: number): Vector2;
    }
    class DrawUtils {
        private constructor();
        /**
         * Draws a line using a point and sizes, rather than two points
         * @param x X-position of line starting point
         * @param y Y-position of line starting point
         * @param w The horizontal distance of the line
         * @param h The vertical distance of the line
         */
        static line(x: number, y: number, w: number, h: number, graphics?: RenderTarget): void;
        static text(font: string, textString: string, x: number, y: number, size?: number, justifyX?: TextAlignHoriz, justifyY?: TextAlignVert, rotation?: number, graphics?: RenderTarget): void;
        static textWidth(text: string, font: string, size: number, style: TextStyle): number;
        /**
         * Gets each individual line of the text, width text wrapping taken into account.
         * @returns An array containing each line of text
         */
        static textLines(text: string, w?: number): string[];
        static textHeight(text: string, font: string, size: number, style: TextStyle): number;
    }
    class Vector2 {
        x: number;
        y: number;
        constructor(x: number, y: number);
        clone(): Vector2;
        copy(destination: Vector2): void;
        /**
         * Creates a new `Vector2` from a given angle (in radians) and magnitude.
         * @param angle Angle (radians)
         * @param magnitude
         */
        static fromAngle(angle: number, magnitude: number): Vector2;
        /**
         * Creates a new `Vector2` from a given angle (in degrees) and magnitude.
         * @param angle Angle (degrees)
         * @param magnitude
         */
        static fromAngleDegrees(angle: number, magnitude: number): Vector2;
        /**
         * Creates a new `Vector2` with the value <0, 0>
         */
        static get zero(): Vector2;
        /**
         * Returns a vector with the mouse coordinates. If the sketch has not been set up yet, returns undefined.
         */
        static getMousePositionVector(): Vector2 | undefined;
        withX(x: number): Vector2;
        withY(y: number): Vector2;
        add(other: Vector2): Vector2;
        sub(other: Vector2): Vector2;
        mult(scalar: number): Vector2;
        mult(other: Vector2): Vector2;
        div(scalar: number): Vector2;
        div(other: Vector2): Vector2;
        mod(scalar: number): Vector2;
        mod(other: Vector2): Vector2;
        dot(other: Vector2): number;
        get magnitude(): number;
        set magnitude(value: number);
        get magSq(): number;
        get angle(): number;
        set angle(value: number);
        normalize(): Vector2;
        lerp(other: Vector2, amt: number): Vector2;
        /**
         * @param centerPoint
         * @param angle Rotation in radians
         */
        rotate(centerPoint: Vector2, angle: number): Vector2;
        /**
         * @param {Vector2} other
         * @returns {boolean}
         */
        equals(other: Vector2): boolean;
        /**
         * Converts the vector to an array containing the x and y component.
         */
        toArray(): number[];
        toString(): string;
    }
    class NumberUtils {
        private constructor();
        static isNullish(n: number): boolean;
    }
    /**
     * Excludes the properties of T where U[T] is of type V
     */
    type ExcludePropertyType<T extends string, U extends {
        [x: string]: any;
    }, V> = U[T] extends V ? never : T;
    namespace Easings {
        type EaseFunction = (t: number) => number;
        class Ease {
            constructor($in: EaseFunction, $out?: EaseFunction, $inout?: EaseFunction);
            readonly in: EaseFunction;
            readonly out: EaseFunction;
            readonly inout: EaseFunction;
            static invert(fn: EaseFunction): EaseFunction;
            static follow(first: EaseFunction, second: EaseFunction): EaseFunction;
        }
        const linear: Ease;
        const quad: Ease;
        const cubic: Ease;
        const quart: Ease;
        const quint: Ease;
        const elastic: Ease;
        const sin: Ease;
        const back: Ease;
    }
}
declare namespace p5Utils.Ext {
    type FancyText = FancyText.TextSegment[];
    namespace FancyText {
        function create(segments: FancyText.TextSegmentData[]): FancyText;
        function draw(graphics: RenderTarget, segments: FancyText, position: Vector2, textSize: number, font: string, justify?: Vector2, alpha?: number): void;
        function getWidth(segments: FancyText, textSize: number, font: string): number;
        const ScriptScale = 0.5;
        type TextPropertiesData = {
            [x in keyof FancyText.TextProperties as ExcludePropertyType<x, FancyText.TextProperties, Function>]?: FancyText.TextProperties[x];
        };
        class TextProperties {
            color: ColorLike;
            script: TextProperties.Script;
            style: TextStyle;
            constructor(props?: TextPropertiesData);
        }
        namespace TextProperties {
            enum Script {
                Normal = 0,
                Subscript = 1,
                Superscript = 2
            }
        }
        type TextSegmentData = {
            text: string;
            properties?: TextProperties | TextPropertiesData;
        };
        class TextSegment {
            text: string;
            properties: TextProperties;
            constructor(text: string, properties?: TextProperties | TextPropertiesData);
            constructor(data: TextSegmentData);
            getWidth(textSize: number, font: string): number;
            draw(graphics: RenderTarget, position: Vector2, textSize: number, font: string, justify?: Vector2, alpha?: number): void;
        }
    }
    namespace FancyText.Animations {
        type AnimTextPropertiesData = FancyText.TextPropertiesData & {
            animID?: string | string[];
        };
        type AnimTextSegmentData = {
            [x in Exclude<keyof FancyText.TextSegmentData, "properties">]: FancyText.TextSegmentData[x];
        } & {
            properties?: AnimTextProperties | AnimTextPropertiesData;
        };
        class AnimTextProperties extends FancyText.TextProperties {
            animID?: string[];
            constructor(props?: AnimTextPropertiesData);
        }
        class AnimTextSegment extends FancyText.TextSegment {
            constructor(data: AnimTextSegmentData);
            constructor(text: string, properties?: AnimTextProperties);
        }
        function create(segments: AnimTextSegmentData[]): FancyText;
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
        function draw(graphics: RenderTarget, lines: FancyText[], position: Vector2, textSize: number, font: string, t: number, justify?: Vector2): void;
    }
}

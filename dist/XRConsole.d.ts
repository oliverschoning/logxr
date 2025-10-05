import { Mesh, Object3D } from 'three';
import { MessageType } from './Message';
export declare type XRConsoleOptions = {
    /**
     * The width of the canvas in pixels.
     * @default 1024
     */
    pixelWidth?: number;
    /**
     * The height of the canvas in pixels.
     * @default 512
     */
    pixelHeight?: number;
    /**
     * The width of the plane in meters.
     * @default 1
     */
    actualWidth?: number;
    /**
     * The height of the plane in meters.
     * @default 1
     */
    actualHeight?: number;
    /**
     * The font size of the text in pixels.
     * @default 16
     */
    fontSize?: number;
    /**
     * The horizontal padding of the text in pixels.
     * @default 5
     */
    horizontalPadding?: number;
    /**
     * The vertical padding of the text in pixels.
     * @default 5
     */
    verticalPadding?: number;
    /**
     * Whether or not to show the timestamp.
     * @default true
     */
    showTimestamp?: boolean;
    /**
     * The type of messages to show.
     * @default MessageType.All
     * @see MessageType
     */
    messageType?: MessageType;
    /**
     * The background color of the canvas.
     * @default '#222222'
     */
    backgroundColor?: string;
    /**
     * The color of the log messages.
     * @default '#FFFFFF'
     */
    logColor?: string;
    /**
     * The color of the error messages.
     * @default '#D0342C'
     */
    errorColor?: string;
    /**
     * The color of the warning messages.
     * @default '#FF7900'
     */
    warningColor?: string;
    /**
     * The color of the info messages.
     * @default '#76B947'
     */
    infoColor?: string;
    /**
     * The color of the debug messages.
     * @default '#0E86D4'
     */
    debugColor?: string;
};
export declare class XRConsole extends Object3D {
    private _canvas;
    private _options;
    panelMesh: Mesh;
    /**
     * flag to indicate that the console canvas needs to be updated
     */
    needsUpdate: boolean;
    constructor(options?: XRConsoleOptions);
    get innerHeight(): number;
    get innerWidth(): number;
    /**
     * Renders the console to the canvas
     * @returns void
     */
    render(): void;
    /**
     * Renders lines of text to the canvas
     * @param lines - The lines to render
     * @param lineHeight - The height of a line in pixels
     * @param charWidth - The width of a character in pixels
     * @param context - The canvas context to render to
     * @returns void
     */
    private _getColorForMessageType;
    /**
     * Generates lines of text to render
     * @param messages - The messages to generate lines for
     * @param numCharsPerLine - The number of characters that can fit on a line
     * @returns lines - The lines to render
     */
    private _generateLines;
    /**
     * Renders lines of text to the canvas
     * @param lines - The lines to render
     * @param lineHeight - The height of a line
     * @param charWidth - The width of a character
     * @param context - The canvas context to render to
     */
    private _renderLines;
    updateMatrixWorld(force?: boolean): void;
}
//# sourceMappingURL=XRConsole.d.ts.map
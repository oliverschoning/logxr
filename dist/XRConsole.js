"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRConsole = void 0;
const three_1 = require("three");
const Message_1 = require("./Message");
const XRConsoleFactory_1 = require("./XRConsoleFactory");
const word_wrap_1 = __importDefault(require("word-wrap"));
const DEFAULT_OPTIONS = {
    pixelWidth: 1024,
    pixelHeight: 512,
    actualWidth: 1,
    actualHeight: 1,
    horizontalPadding: 5,
    verticalPadding: 5,
    fontSize: 16,
    showTimestamp: true,
    messageType: Message_1.MessageType.All,
    backgroundColor: '#222222',
    logColor: '#FFFFFF',
    errorColor: '#D0342C',
    warningColor: '#FF7900',
    infoColor: '#76B947',
    debugColor: '#0E86D4',
};
class XRConsole extends three_1.Object3D {
    _canvas;
    _options;
    panelMesh;
    /**
     * flag to indicate that the console canvas needs to be updated
     */
    needsUpdate = true;
    constructor(options = {}) {
        super();
        this._options = {
            pixelWidth: options.pixelWidth ?? DEFAULT_OPTIONS.pixelWidth,
            pixelHeight: options.pixelHeight ?? DEFAULT_OPTIONS.pixelHeight,
            actualWidth: options.actualWidth ?? DEFAULT_OPTIONS.actualWidth,
            actualHeight: options.actualHeight ?? DEFAULT_OPTIONS.actualHeight,
            horizontalPadding: options.horizontalPadding ?? DEFAULT_OPTIONS.horizontalPadding,
            verticalPadding: options.verticalPadding ?? DEFAULT_OPTIONS.verticalPadding,
            fontSize: options.fontSize ?? DEFAULT_OPTIONS.fontSize,
            showTimestamp: options.showTimestamp ?? DEFAULT_OPTIONS.showTimestamp,
            messageType: options.messageType || DEFAULT_OPTIONS.messageType,
            backgroundColor: options.backgroundColor ?? DEFAULT_OPTIONS.backgroundColor,
            logColor: options.logColor ?? DEFAULT_OPTIONS.logColor,
            errorColor: options.errorColor ?? DEFAULT_OPTIONS.errorColor,
            warningColor: options.warningColor ?? DEFAULT_OPTIONS.warningColor,
            infoColor: options.infoColor ?? DEFAULT_OPTIONS.infoColor,
            debugColor: options.debugColor ?? DEFAULT_OPTIONS.debugColor,
        };
        this._canvas = document.createElement('canvas');
        this._canvas.width = this._options.pixelWidth;
        this._canvas.height = this._options.pixelHeight;
        this.panelMesh = new three_1.Mesh(new three_1.PlaneGeometry(options.actualWidth, options.actualHeight), new three_1.MeshBasicMaterial({
            side: three_1.DoubleSide,
            map: new three_1.CanvasTexture(this._canvas),
        }));
        this.add(this.panelMesh);
    }
    get innerHeight() {
        return this._options.pixelHeight - this._options.verticalPadding * 2;
    }
    get innerWidth() {
        return this._options.pixelWidth - this._options.horizontalPadding * 2;
    }
    /**
     * Renders the console to the canvas
     * @returns void
     */
    render() {
        // clear canvas
        const context = this._canvas.getContext('2d');
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        context.fillStyle = this._options.backgroundColor;
        context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        // measure text
        context.font = `${this._options.fontSize}px monospace`;
        context.textBaseline = 'bottom';
        const textMetrics = context.measureText('M');
        const lineHeight = textMetrics.actualBoundingBoxAscent * 1.2;
        const numLines = Math.ceil(this.innerHeight / lineHeight);
        const numCharsPerLine = Math.floor(this.innerWidth / textMetrics.width);
        const messages = XRConsoleFactory_1.XRConsoleFactory.getInstance().getMessages(this._options.messageType, numLines);
        const lines = this._generateLines(messages, numCharsPerLine);
        this._renderLines(lines, lineHeight, textMetrics.width, context);
        this.panelMesh.material.map.dispose();
        this.panelMesh.material.map = new three_1.CanvasTexture(this._canvas);
        this.needsUpdate = false;
    }
    /**
     * Renders lines of text to the canvas
     * @param lines - The lines to render
     * @param lineHeight - The height of a line in pixels
     * @param charWidth - The width of a character in pixels
     * @param context - The canvas context to render to
     * @returns void
     */
    _getColorForMessageType(messageType) {
        switch (messageType) {
            case Message_1.MessageType.Log:
                return this._options.logColor;
            case Message_1.MessageType.Error:
                return this._options.errorColor;
            case Message_1.MessageType.Warning:
                return this._options.warningColor;
            case Message_1.MessageType.Info:
                return this._options.infoColor;
            case Message_1.MessageType.Debug:
                return this._options.debugColor;
        }
        throw new Error('Invalid message type');
    }
    /**
     * Generates lines of text to render
     * @param messages - The messages to generate lines for
     * @param numCharsPerLine - The number of characters that can fit on a line
     * @returns lines - The lines to render
     */
    _generateLines(messages, numCharsPerLine) {
        const lines = [];
        messages.forEach((message) => {
            const timestamp = this._options.showTimestamp
                ? buildReadableTimestamp(message.timestamp) + ' '
                : '';
            const textLines = wrapText(message.content, numCharsPerLine - timestamp.length);
            const localLines = [];
            textLines.forEach((textLine, index) => {
                localLines.unshift({
                    text: index == 0 ? timestamp + textLine : textLine,
                    color: this._getColorForMessageType(message.type),
                    indent: index == 0 ? 0 : timestamp.length,
                });
            });
            lines.push(...localLines);
        });
        return lines;
    }
    /**
     * Renders lines of text to the canvas
     * @param lines - The lines to render
     * @param lineHeight - The height of a line
     * @param charWidth - The width of a character
     * @param context - The canvas context to render to
     */
    _renderLines(lines, lineHeight, charWidth, context) {
        let y = Math.min(this.innerHeight, lines.length * lineHeight) +
            this._options.verticalPadding;
        lines.forEach((line) => {
            context.fillStyle = line.color;
            context.fillText(line.text, line.indent * charWidth + this._options.horizontalPadding, y);
            y -= lineHeight;
        });
    }
    updateMatrixWorld(force) {
        super.updateMatrixWorld(force);
        if (this.needsUpdate) {
            this.render();
        }
    }
}
exports.XRConsole = XRConsole;
/**
 * Wraps text to a given number of characters per line
 * @param text - text to wrap
 * @param numCharsPerLine - number of characters per line
 * @returns array of lines
 */
const wrapText = (text, numCharsPerLine) => {
    const lines = [];
    const unwrappedLines = text.split('\n');
    unwrappedLines.forEach((line) => {
        const wrappedLines = (0, word_wrap_1.default)(line, {
            width: numCharsPerLine,
            indent: '',
            trim: true,
        }).split('\n');
        wrappedLines.forEach((wrappedLine) => {
            lines.push(wrappedLine);
        });
    });
    return lines;
};
/**
 * builds a readable timestamp from a timestamp in milliseconds
 * @param timestamp - timestamp in milliseconds
 * @returns readable timestamp
 */
const buildReadableTimestamp = (timestamp) => {
    const pad = (n, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s);
    const d = new Date(timestamp);
    return `[${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}]`;
};
//# sourceMappingURL=XRConsole.js.map
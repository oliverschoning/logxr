import { Message, MessageType } from './Message';
import { XRConsole, XRConsoleOptions } from './XRConsole';
export declare class XRConsoleFactory {
    private static _instance;
    private _messageQueue;
    private _consoleInstances;
    private _maxNumMessages;
    private constructor();
    static getInstance(): XRConsoleFactory;
    private _pushMessage;
    get maxNumMessages(): number;
    set maxNumMessages(value: number);
    createConsole(options: XRConsoleOptions): XRConsole;
    getMessages(messageType: MessageType, count: number): Message[];
}
//# sourceMappingURL=XRConsoleFactory.d.ts.map
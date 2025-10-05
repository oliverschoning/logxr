export declare enum MessageType {
    Log = 1,
    Error = 2,
    Warning = 3,
    Info = 4,
    Debug = 5,
    All = 6
}
export declare type Message = {
    type: MessageType;
    timestamp: number;
    content: string;
};
//# sourceMappingURL=Message.d.ts.map
// !!! This content is generated by the multiplayer backend tool. Do not modify manually !!!
// !!! Last Updated (DD/MM/YYYY HH:MM:SS CET): 30/09/2024 10:02:46 CEST !!!

export enum OriginType {
    Server = 'server',
    Owner = 'owner',
    Guest = 'guest',
}

export enum GoType {
    BOOL = 'bool',
    INT = 'int',
    INT8 = 'int8',
    INT16 = 'int16',
    INT32 = 'int32',
    INT64 = 'int64',
    UINT = 'uint',
    UINT8 = 'uint8',
    UINT16 = 'uint16',
    UINT32 = 'uint32',
    UINT64 = 'uint64',
    FLOAT32 = 'float32',
    FLOAT64 = 'float64',
    COMPLEX64 = 'complex64',
    COMPLEX128 = 'complex128',
    STRING = 'string',
}

export type SendPermissions = { [key in OriginType]: boolean };

export type MessageElementDescriptor = {
    byteSize: number;
    offset: number;
    description: string;
    fieldName: string;
    type: GoType;
};

export type EventSpecification<T> = {
    id: number;
    name: string;
    permissions: SendPermissions;
    expectedMinSize: number;
    structure: MessageElementDescriptor[];
};

export enum EventType {
    DEBUG_INFO = 0,
    PLAYER_JOINED = 1,
    PLAYER_JOIN_ATTEMPT = 2,
    PLAYER_JOIN_ACCEPTED = 3,
    PLAYER_JOIN_DECLINED = 4,
    PLAYER_LEFT = 5,
    LOBBY_CLOSING = 6,
    PLAYER_LEAVING = 7,
    SERVER_CLOSING = 8,
    ENTER_LOCATION = 1001,
    PLAYER_MOVE = 1002,
    DIFFICULTY_SELECT_FOR_MINIGAME = 2000,
    DIFFICULTY_CONFIRMED_FOR_MINIGAME = 2001,
    PLAYERS_DECLARE_INTENT_FOR_MINIGAME = 2002,
    PLAYER_READY_FOR_MINIGAME = 2003,
    PLAYER_ABORTING_MINIGAME = 2004,
    ENTER_MINIGAME = 2005,
}

export interface IMessage {
    senderID: number;
    eventID: number;
}

export interface DebugInfoMessageDTO extends IMessage {
    /** HTTP Code (if applicable)
     * go type: uint32
     */
    code: number;
    /** Debug message
     * go type: string
     */
    message: string;
}
/** DebugInfo Message Structure
 *
 * *	8b --> 12b:	uint32    :	HTTP Code (if applicable)
 * *	12b --> +Nb:	string    :	Debug message
 */
export const DEBUG_INFO_EVENT: EventSpecification<DebugInfoMessageDTO> = {
    id: EventType.DEBUG_INFO,
    name: 'DebugInfo',
    permissions: { guest: true, owner: true, server: true },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'HTTP Code (if applicable)',
            fieldName: 'code',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Debug message',
            fieldName: 'message',
            type: GoType.STRING,
        },
    ],
};
export interface PlayerJoinedMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerJoined Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_JOINED_EVENT: EventSpecification<PlayerJoinedMessageDTO> = {
    id: EventType.PLAYER_JOINED,
    name: 'PlayerJoined',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface PlayerJoinAttemptMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerJoinAttempt Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_JOIN_ATTEMPT_EVENT: EventSpecification<PlayerJoinAttemptMessageDTO> = {
    id: EventType.PLAYER_JOIN_ATTEMPT,
    name: 'PlayerJoinAttempt',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface PlayerJoinAcceptedMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerJoinAccepted Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_JOIN_ACCEPTED_EVENT: EventSpecification<PlayerJoinAcceptedMessageDTO> = {
    id: EventType.PLAYER_JOIN_ACCEPTED,
    name: 'PlayerJoinAccepted',
    permissions: { server: false, guest: false, owner: true },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface PlayerJoinDeclinedMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerJoinDeclined Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_JOIN_DECLINED_EVENT: EventSpecification<PlayerJoinDeclinedMessageDTO> = {
    id: EventType.PLAYER_JOIN_DECLINED,
    name: 'PlayerJoinDeclined',
    permissions: { guest: false, owner: true, server: false },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface PlayerLeftMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerLeft Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_LEFT_EVENT: EventSpecification<PlayerLeftMessageDTO> = {
    id: EventType.PLAYER_LEFT,
    name: 'PlayerLeft',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface LobbyClosingMessageDTO extends IMessage {}
/** LobbyClosing Message Structure
 *
 */
export const LOBBY_CLOSING_EVENT: EventSpecification<LobbyClosingMessageDTO> = {
    id: EventType.LOBBY_CLOSING,
    name: 'LobbyClosing',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};
export interface PlayerLeavingMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerLeaving Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_LEAVING_EVENT: EventSpecification<PlayerLeavingMessageDTO> = {
    id: EventType.PLAYER_LEAVING,
    name: 'PlayerLeaving',
    permissions: { guest: true, owner: true, server: false },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface ServerClosingMessageDTO extends IMessage {}
/** ServerClosing Message Structure
 *
 */
export const SERVER_CLOSING_EVENT: EventSpecification<ServerClosingMessageDTO> = {
    id: EventType.SERVER_CLOSING,
    name: 'ServerClosing',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};
export interface EnterLocationMessageDTO extends IMessage {
    /** Location ID
     * go type: uint32
     */
    id: number;
}
/** EnterLocation Message Structure
 *
 * *	8b --> 12b:	uint32    :	Location ID
 */
export const ENTER_LOCATION_EVENT: EventSpecification<EnterLocationMessageDTO> = {
    id: EventType.ENTER_LOCATION,
    name: 'EnterLocation',
    permissions: { guest: false, owner: true, server: false },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Location ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
    ],
};
export interface PlayerMoveMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    playerID: number;
    /** Location ID
     * go type: uint32
     */
    locationID: number;
}
/** PlayerMove Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> 16b:	uint32    :	Location ID
 */
export const PLAYER_MOVE_EVENT: EventSpecification<PlayerMoveMessageDTO> = {
    id: EventType.PLAYER_MOVE,
    name: 'PlayerMove',
    permissions: { guest: true, owner: true, server: false },
    expectedMinSize: 16,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'playerID',
            type: GoType.UINT32,
        },
        {
            byteSize: 4,
            offset: 12,
            description: 'Location ID',
            fieldName: 'locationID',
            type: GoType.UINT32,
        },
    ],
};
export interface DifficultySelectForMinigameMessageDTO extends IMessage {
    /** Minigame ID
     * go type: uint32
     */
    minigameID: number;
    /** Difficulty ID
     * go type: uint32
     */
    difficultyID: number;
    /** Difficulty Name
     * go type: string
     */
    difficultyName: string;
}
/** DifficultySelectForMinigame Message Structure
 *
 * *	8b --> 12b:	uint32    :	Minigame ID
 * *	12b --> 16b:	uint32    :	Difficulty ID
 * *	16b --> +Nb:	string    :	Difficulty Name
 */
export const DIFFICULTY_SELECT_FOR_MINIGAME_EVENT: EventSpecification<DifficultySelectForMinigameMessageDTO> = {
    id: EventType.DIFFICULTY_SELECT_FOR_MINIGAME,
    name: 'DifficultySelectForMinigame',
    permissions: { guest: false, owner: true, server: false },
    expectedMinSize: 16,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Minigame ID',
            fieldName: 'minigameID',
            type: GoType.UINT32,
        },
        {
            byteSize: 4,
            offset: 12,
            description: 'Difficulty ID',
            fieldName: 'difficultyID',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 16,
            description: 'Difficulty Name',
            fieldName: 'difficultyName',
            type: GoType.STRING,
        },
    ],
};
export interface DifficultyConfirmedForMinigameMessageDTO extends IMessage {
    /** Minigame ID
     * go type: uint32
     */
    minigameID: number;
    /** Difficulty ID
     * go type: uint32
     */
    difficultyID: number;
    /** Difficulty Name
     * go type: string
     */
    difficultyName: string;
}
/** DifficultyConfirmedForMinigame Message Structure
 *
 * *	8b --> 12b:	uint32    :	Minigame ID
 * *	12b --> 16b:	uint32    :	Difficulty ID
 * *	16b --> +Nb:	string    :	Difficulty Name
 */
export const DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT: EventSpecification<DifficultyConfirmedForMinigameMessageDTO> = {
    id: EventType.DIFFICULTY_CONFIRMED_FOR_MINIGAME,
    name: 'DifficultyConfirmedForMinigame',
    permissions: { owner: true, server: false, guest: false },
    expectedMinSize: 16,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Minigame ID',
            fieldName: 'minigameID',
            type: GoType.UINT32,
        },
        {
            byteSize: 4,
            offset: 12,
            description: 'Difficulty ID',
            fieldName: 'difficultyID',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 16,
            description: 'Difficulty Name',
            fieldName: 'difficultyName',
            type: GoType.STRING,
        },
    ],
};
export interface PlayersDeclareIntentForMinigameMessageDTO extends IMessage {}
/** PlayersDeclareIntentForMinigame Message Structure
 *
 */
export const PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT: EventSpecification<PlayersDeclareIntentForMinigameMessageDTO> = {
    id: EventType.PLAYERS_DECLARE_INTENT_FOR_MINIGAME,
    name: 'PlayersDeclareIntentForMinigame',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};
export interface PlayerReadyForMinigameMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerReadyForMinigame Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_READY_FOR_MINIGAME_EVENT: EventSpecification<PlayerReadyForMinigameMessageDTO> = {
    id: EventType.PLAYER_READY_FOR_MINIGAME,
    name: 'PlayerReadyForMinigame',
    permissions: { guest: true, owner: true, server: false },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface PlayerAbortingMinigameMessageDTO extends IMessage {
    /** Player ID
     * go type: uint32
     */
    id: number;
    /** Player IGN
     * go type: string
     */
    ign: string;
}
/** PlayerAbortingMinigame Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_ABORTING_MINIGAME_EVENT: EventSpecification<PlayerAbortingMinigameMessageDTO> = {
    id: EventType.PLAYER_ABORTING_MINIGAME,
    name: 'PlayerAbortingMinigame',
    permissions: { guest: true, owner: true, server: false },
    expectedMinSize: 12,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 0,
            offset: 12,
            description: 'Player IGN',
            fieldName: 'ign',
            type: GoType.STRING,
        },
    ],
};
export interface EnterMinigameMessageDTO extends IMessage {}
/** EnterMinigame Message Structure
 *
 */
export const ENTER_MINIGAME_EVENT: EventSpecification<EnterMinigameMessageDTO> = {
    id: EventType.ENTER_MINIGAME,
    name: 'EnterMinigame',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};

export const EVENT_ID_MAP: { [key: number]: EventSpecification<any> } = {
    0: DEBUG_INFO_EVENT,
    1: PLAYER_JOINED_EVENT,
    2: PLAYER_JOIN_ATTEMPT_EVENT,
    3: PLAYER_JOIN_ACCEPTED_EVENT,
    4: PLAYER_JOIN_DECLINED_EVENT,
    5: PLAYER_LEFT_EVENT,
    6: LOBBY_CLOSING_EVENT,
    7: PLAYER_LEAVING_EVENT,
    8: SERVER_CLOSING_EVENT,
    1001: ENTER_LOCATION_EVENT,
    1002: PLAYER_MOVE_EVENT,
    2000: DIFFICULTY_SELECT_FOR_MINIGAME_EVENT,
    2001: DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT,
    2002: PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT,
    2003: PLAYER_READY_FOR_MINIGAME_EVENT,
    2004: PLAYER_ABORTING_MINIGAME_EVENT,
    2005: ENTER_MINIGAME_EVENT,
};
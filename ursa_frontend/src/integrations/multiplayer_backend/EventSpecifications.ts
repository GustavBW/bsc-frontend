// !!! This content is generated by the multiplayer backend tool. Do not modify manually !!!
// !!! Last Updated (DD/MM/YYYY HH:MM:SS CET): 11/10/2024 22:09:10 CEST !!!

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
    PLAYER_LEFT = 5,
    LOBBY_CLOSING = 6,
    SERVER_CLOSING = 8,
    ENTER_LOCATION = 1001,
    PLAYER_MOVE = 1002,
    DIFFICULTY_SELECT_FOR_MINIGAME = 2000,
    DIFFICULTY_CONFIRMED_FOR_MINIGAME = 2001,
    PLAYERS_DECLARE_INTENT_FOR_MINIGAME = 2002,
    PLAYER_READY_FOR_MINIGAME = 2003,
    PLAYER_ABORTING_MINIGAME = 2004,
    MINIGAME_BEGINS = 2005,
    PLAYER_JOIN_ACTIVITY = 2006,
    ASTEROIDS_ASTEROID_SPAWN = 3000,
    ASTEROIDS_ASSIGN_PLAYER_DATA = 3001,
    ASTEROIDS_ASTEROID_IMPACT_ON_COLONY = 3002,
    ASTEROIDS_PLAYER_SHOOT_AT_CODE = 3003,
    ASTEROIDS_GAME_WON = 3004,
    ASTEROIDS_GAME_LOST = 3005,
    ASTEROIDS_UNTIMELY_ABORT_GAME = 3006,
}

export interface IMessage {
    senderID: number;
    eventID: number;
}

/**
 * For debug messages
 */
export interface DebugInfoMessageDTO extends IMessage {
    /** HTTP Code (if applicable)
     *
     * go type: uint32
     */
    code: number;
    /** Debug message
     *
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
/**
 * Sent when a player joins the lobby
 */
export interface PlayerJoinedMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    id: number;
    /** Player IGN
     *
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
/**
 * Sent when a player leaves the lobby
 */
export interface PlayerLeftMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    id: number;
    /** Player IGN
     *
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
/**
 * Sent when the lobby closes
 */
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
/**
 * Sent when the server shuts down, followed by LOBBY CLOSING
 */
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
/**
 * Send when the owner enters a location
 */
export interface EnterLocationMessageDTO extends IMessage {
    /** Colony Location ID
     *
     * go type: uint32
     */
    id: number;
}
/** EnterLocation Message Structure
 *
 * *	8b --> 12b:	uint32    :	Colony Location ID
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
            description: 'Colony Location ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
    ],
};
/**
 * Sent when any player moves to some location
 */
export interface PlayerMoveMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    playerID: number;
    /** Colony Location ID
     *
     * go type: uint32
     */
    colonyLocationID: number;
}
/** PlayerMove Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> 16b:	uint32    :	Colony Location ID
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
            description: 'Colony Location ID',
            fieldName: 'colonyLocationID',
            type: GoType.UINT32,
        },
    ],
};
/**
 * Sent when the owner selects a difficulty (NOT CONFIRM)
 */
export interface DifficultySelectForMinigameMessageDTO extends IMessage {
    /** Minigame ID
     *
     * go type: uint32
     */
    minigameID: number;
    /** Difficulty ID
     *
     * go type: uint32
     */
    difficultyID: number;
    /** Difficulty Name
     *
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
/**
 * Sent when the owner confirms a selected difficulty
 */
export interface DifficultyConfirmedForMinigameMessageDTO extends IMessage {
    /** Minigame ID
     *
     * go type: uint32
     */
    minigameID: number;
    /** Difficulty ID
     *
     * go type: uint32
     */
    difficultyID: number;
    /** Difficulty Name
     *
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
/**
 * sent after the server hasrecieved PLAYER JOIN ACTIVITY or PLAYER ABORTING MINIGAME from all players in the lobby
 */
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
/**
 * sent when a player has loaded into a specific minigame
 */
export interface PlayerReadyForMinigameMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    id: number;
    /** Player IGN
     *
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
    permissions: { owner: true, server: false, guest: true },
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
/**
 * sent when a player opts out of the minigame by leaving the hand position check
 */
export interface PlayerAbortingMinigameMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    id: number;
    /** Player IGN
     *
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
/**
 * Sent when the server has recieved PLAYER READY from all participants
 */
export interface MinigameBeginsMessageDTO extends IMessage {}
/** MinigameBegins Message Structure
 *
 */
export const MINIGAME_BEGINS_EVENT: EventSpecification<MinigameBeginsMessageDTO> = {
    id: EventType.MINIGAME_BEGINS,
    name: 'MinigameBegins',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};
/**
 * sent when a player has passed the hand position check
 */
export interface PlayerJoinActivityMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    id: number;
    /** Player IGN
     *
     * go type: string
     */
    ign: string;
}
/** PlayerJoinActivity Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	Player IGN
 */
export const PLAYER_JOIN_ACTIVITY_EVENT: EventSpecification<PlayerJoinActivityMessageDTO> = {
    id: EventType.PLAYER_JOIN_ACTIVITY,
    name: 'PlayerJoinActivity',
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
/**
 * Sent when the server spawns a new asteroid
 */
export interface AsteroidsAsteroidSpawnMessageDTO extends IMessage {
    /** ID
     *
     * go type: uint32
     */
    id: number;
    /** X Offset
     *
     * go type: float32
     */
    x: number;
    /** Y Offset
     *
     * go type: float32
     */
    y: number;
    /** Health
     *
     * go type: uint8
     */
    health: number;
    /** Time until impact
     *
     * go type: uint8
     */
    timeUntilImpact: number;
    /** Asteroid Type
     *
     * go type: uint8
     */
    type: number;
    /** CharCode
     *
     * go type: string
     */
    charCode: string;
}
/** AsteroidsAsteroidSpawn Message Structure
 *
 * *	8b --> 12b:	uint32    :	ID
 * *	12b --> 16b:	float32   :	X Offset
 * *	16b --> 20b:	float32   :	Y Offset
 * *	20b --> 21b:	uint8     :	Health
 * *	21b --> 22b:	uint8     :	Time until impact
 * *	22b --> 23b:	uint8     :	Asteroid Type
 * *	23b --> +Nb:	string    :	CharCode
 */
export const ASTEROIDS_ASTEROID_SPAWN_EVENT: EventSpecification<AsteroidsAsteroidSpawnMessageDTO> = {
    id: EventType.ASTEROIDS_ASTEROID_SPAWN,
    name: 'AsteroidsAsteroidSpawn',
    permissions: { server: true, guest: false, owner: false },
    expectedMinSize: 23,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 4,
            offset: 12,
            description: 'X Offset',
            fieldName: 'x',
            type: GoType.FLOAT32,
        },
        {
            byteSize: 4,
            offset: 16,
            description: 'Y Offset',
            fieldName: 'y',
            type: GoType.FLOAT32,
        },
        {
            byteSize: 1,
            offset: 20,
            description: 'Health',
            fieldName: 'health',
            type: GoType.UINT8,
        },
        {
            byteSize: 1,
            offset: 21,
            description: 'Time until impact',
            fieldName: 'timeUntilImpact',
            type: GoType.UINT8,
        },
        {
            byteSize: 1,
            offset: 22,
            description: 'Asteroid Type',
            fieldName: 'type',
            type: GoType.UINT8,
        },
        {
            byteSize: 0,
            offset: 23,
            description: 'CharCode',
            fieldName: 'charCode',
            type: GoType.STRING,
        },
    ],
};
/**
 * Sent to all players when the server has assigned the graphical layout
 */
export interface AsteroidsAssignPlayerDataMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    id: number;
    /** X Position
     *
     * go type: float32
     */
    x: number;
    /** Y Position
     *
     * go type: float32
     */
    y: number;
    /** Tank Type
     *
     * go type: uint8
     */
    type: number;
    /** CharCode
     *
     * go type: string
     */
    code: string;
}
/** AsteroidsAssignPlayerData Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> 16b:	float32   :	X Position
 * *	16b --> 20b:	float32   :	Y Position
 * *	20b --> 21b:	uint8     :	Tank Type
 * *	21b --> +Nb:	string    :	CharCode
 */
export const ASTEROIDS_ASSIGN_PLAYER_DATA_EVENT: EventSpecification<AsteroidsAssignPlayerDataMessageDTO> = {
    id: EventType.ASTEROIDS_ASSIGN_PLAYER_DATA,
    name: 'AsteroidsAssignPlayerData',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 21,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Player ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 4,
            offset: 12,
            description: 'X Position',
            fieldName: 'x',
            type: GoType.FLOAT32,
        },
        {
            byteSize: 4,
            offset: 16,
            description: 'Y Position',
            fieldName: 'y',
            type: GoType.FLOAT32,
        },
        {
            byteSize: 1,
            offset: 20,
            description: 'Tank Type',
            fieldName: 'type',
            type: GoType.UINT8,
        },
        {
            byteSize: 0,
            offset: 21,
            description: 'CharCode',
            fieldName: 'code',
            type: GoType.STRING,
        },
    ],
};
/**
 * Sent when the server has determined an asteroid has impacted the colony
 */
export interface AsteroidsAsteroidImpactOnColonyMessageDTO extends IMessage {
    /** Asteroid ID
     *
     * go type: uint32
     */
    id: number;
    /** Remaining Colony Health
     *
     * go type: uint32
     */
    colonyHPLeft: number;
}
/** AsteroidsAsteroidImpactOnColony Message Structure
 *
 * *	8b --> 12b:	uint32    :	Asteroid ID
 * *	12b --> 16b:	uint32    :	Remaining Colony Health
 */
export const ASTEROIDS_ASTEROID_IMPACT_ON_COLONY_EVENT: EventSpecification<AsteroidsAsteroidImpactOnColonyMessageDTO> = {
    id: EventType.ASTEROIDS_ASTEROID_IMPACT_ON_COLONY,
    name: 'AsteroidsAsteroidImpactOnColony',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 16,
    structure: [
        {
            byteSize: 4,
            offset: 8,
            description: 'Asteroid ID',
            fieldName: 'id',
            type: GoType.UINT32,
        },
        {
            byteSize: 4,
            offset: 12,
            description: 'Remaining Colony Health',
            fieldName: 'colonyHPLeft',
            type: GoType.UINT32,
        },
    ],
};
/**
 * Sent when any player shoots at some char combination (code)
 */
export interface AsteroidsPlayerShootAtCodeMessageDTO extends IMessage {
    /** Player ID
     *
     * go type: uint32
     */
    id: number;
    /** CharCode
     *
     * go type: string
     */
    code: string;
}
/** AsteroidsPlayerShootAtCode Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	CharCode
 */
export const ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT: EventSpecification<AsteroidsPlayerShootAtCodeMessageDTO> = {
    id: EventType.ASTEROIDS_PLAYER_SHOOT_AT_CODE,
    name: 'AsteroidsPlayerShootAtCode',
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
            description: 'CharCode',
            fieldName: 'code',
            type: GoType.STRING,
        },
    ],
};
/**
 * Sent when the server has determined that the game is won
 */
export interface AsteroidsGameWonMessageDTO extends IMessage {}
/** AsteroidsGameWon Message Structure
 *
 */
export const ASTEROIDS_GAME_WON_EVENT: EventSpecification<AsteroidsGameWonMessageDTO> = {
    id: EventType.ASTEROIDS_GAME_WON,
    name: 'AsteroidsGameWon',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};
/**
 * Sent when the server has determined that a game is lost
 */
export interface AsteroidsGameLostMessageDTO extends IMessage {}
/** AsteroidsGameLost Message Structure
 *
 */
export const ASTEROIDS_GAME_LOST_EVENT: EventSpecification<AsteroidsGameLostMessageDTO> = {
    id: EventType.ASTEROIDS_GAME_LOST,
    name: 'AsteroidsGameLost',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};
/**
 * Sent when something goes wrong
 */
export interface AsteroidsUntimelyAbortGameMessageDTO extends IMessage {}
/** AsteroidsUntimelyAbortGame Message Structure
 *
 */
export const ASTEROIDS_UNTIMELY_ABORT_GAME_EVENT: EventSpecification<AsteroidsUntimelyAbortGameMessageDTO> = {
    id: EventType.ASTEROIDS_UNTIMELY_ABORT_GAME,
    name: 'AsteroidsUntimelyAbortGame',
    permissions: { guest: false, owner: false, server: true },
    expectedMinSize: 8,
    structure: [],
};

export const EVENT_ID_MAP: { [key: number]: EventSpecification<any> } = {
    0: DEBUG_INFO_EVENT,
    1: PLAYER_JOINED_EVENT,
    5: PLAYER_LEFT_EVENT,
    6: LOBBY_CLOSING_EVENT,
    8: SERVER_CLOSING_EVENT,
    1001: ENTER_LOCATION_EVENT,
    1002: PLAYER_MOVE_EVENT,
    2000: DIFFICULTY_SELECT_FOR_MINIGAME_EVENT,
    2001: DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT,
    2002: PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT,
    2003: PLAYER_READY_FOR_MINIGAME_EVENT,
    2004: PLAYER_ABORTING_MINIGAME_EVENT,
    2005: MINIGAME_BEGINS_EVENT,
    2006: PLAYER_JOIN_ACTIVITY_EVENT,
    3000: ASTEROIDS_ASTEROID_SPAWN_EVENT,
    3001: ASTEROIDS_ASSIGN_PLAYER_DATA_EVENT,
    3002: ASTEROIDS_ASTEROID_IMPACT_ON_COLONY_EVENT,
    3003: ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT,
    3004: ASTEROIDS_GAME_WON_EVENT,
    3005: ASTEROIDS_GAME_LOST_EVENT,
    3006: ASTEROIDS_UNTIMELY_ABORT_GAME_EVENT,
};

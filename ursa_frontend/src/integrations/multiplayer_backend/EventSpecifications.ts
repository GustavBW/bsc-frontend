// !!! This content is generated by the multiplayer backend tool. Do not modify manually !!!
// !!! Last Updated (DD/MM/YYYY HH:MM:SS CET): 08/11/2024 16:54:32 CET !!!

export enum OriginType {
	Server = "server",
	Owner = "owner",
	Guest = "guest"
};

export enum GoType {
	BOOL = "bool",
	INT = "int",
	INT8 = "int8",
	INT16 = "int16",
	INT32 = "int32",
	INT64 = "int64",
	UINT = "uint",
	UINT8 = "uint8",
	UINT16 = "uint16",
	UINT32 = "uint32",
	UINT64 = "uint64",
	FLOAT32 = "float32",
	FLOAT64 = "float64",
	COMPLEX64 = "complex64",
	COMPLEX128 = "complex128",
	STRING = "string",
};

export type SendPermissions = { [key in OriginType]: boolean };

export type MessageElementDescriptor = {
	byteSize: number,
	offset: number,
	description: string,
	fieldName: string,
	type: GoType
};

export type EventSpecification<T> = {
	id: number,
	name: string,
	permissions: SendPermissions,
	expectedMinSize: number
	structure: MessageElementDescriptor[]
};

export enum EventType {
	DEBUG_INFO = 1,
	SERVER_CLOSING = 2,
	PLAYER_JOINED = 11,
	PLAYER_LEFT = 12,
	LOBBY_CLOSING = 13,
	ENTER_LOCATION = 1001,
	PLAYER_MOVE = 1002,
	LOCATION_UPGRADE = 1003,
	DIFFICULTY_SELECT_FOR_MINIGAME = 2000,
	DIFFICULTY_CONFIRMED_FOR_MINIGAME = 2001,
	PLAYERS_DECLARE_INTENT_FOR_MINIGAME = 2002,
	PLAYER_READY_FOR_MINIGAME = 2003,
	PLAYER_ABORTING_MINIGAME = 2004,
	MINIGAME_BEGINS = 2005,
	PLAYER_JOIN_ACTIVITY = 2006,
	PLAYER_LOAD_FAILURE = 2007,
	GENERIC_MINIGAME_UNTIMELY_ABORT = 2008,
	PLAYER_LOAD_COMPLETE = 2009,
	LOAD_MINIGAME = 2010,
	GENERIC_MINIGAME_SEQUENCE_RESET = 2011,
	MINIGAME_WON = 2012,
	MINIGAME_LOST = 2013,
	ASTEROIDS_ASTEROID_SPAWN = 3000,
	ASTEROIDS_ASSIGN_PLAYER_DATA = 3001,
	ASTEROIDS_ASTEROID_IMPACT_ON_COLONY = 3002,
	ASTEROIDS_PLAYER_SHOOT_AT_CODE = 3003,
	ASTEROIDS_PLAYER_PENALTY = 3007,
};


export enum PlayerPenaltyType {
	Miss = "miss",
	FriendlyFire = "friendlyFire",
};

export interface IMessage {
	senderID: number
	eventID: number
}

/**
 * For debug messages
 */
export interface DebugInfoMessageDTO extends IMessage {
	/** HTTP Code-like (if applicable)
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
 * *	8b --> 12b:	uint32    :	HTTP Code-like (if applicable)
 * *	12b --> +Nb:	string    :	Debug message
 */
export const DEBUG_INFO_EVENT: EventSpecification<DebugInfoMessageDTO> = {
	id: EventType.DEBUG_INFO,
	name: "DebugInfo",
	permissions: {server: true, guest: false, owner: false},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "HTTP Code-like (if applicable)",
			fieldName: "code",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "Debug message",
			fieldName: "message",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the server shuts down, followed by LOBBY CLOSING
 */
export interface ServerClosingMessageDTO extends IMessage {
}
/** ServerClosing Message Structure
 *
 */
export const SERVER_CLOSING_EVENT: EventSpecification<ServerClosingMessageDTO> = {
	id: EventType.SERVER_CLOSING,
	name: "ServerClosing",
	permissions: {owner: false, server: true, guest: false},
	expectedMinSize: 0,
	structure: [
	]
}
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
	name: "PlayerJoined",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "Player IGN",
			fieldName: "ign",
			type: GoType.STRING
		}
	]
}
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
	name: "PlayerLeft",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "Player IGN",
			fieldName: "ign",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the lobby closes
 */
export interface LobbyClosingMessageDTO extends IMessage {
}
/** LobbyClosing Message Structure
 *
 */
export const LOBBY_CLOSING_EVENT: EventSpecification<LobbyClosingMessageDTO> = {
	id: EventType.LOBBY_CLOSING,
	name: "LobbyClosing",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 0,
	structure: [
	]
}
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
	name: "EnterLocation",
	permissions: {guest: false, owner: true, server: false},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Colony Location ID",
			fieldName: "id",
			type: GoType.UINT32
		}
	]
}
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
	name: "PlayerMove",
	permissions: {server: false, guest: true, owner: true},
	expectedMinSize: 8,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "playerID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "Colony Location ID",
			fieldName: "colonyLocationID",
			type: GoType.UINT32
		}
	]
}
/**
 * Sent from the server when a minigame is won which upgrades a location
 */
export interface LocationUpgradeMessageDTO extends IMessage {
	/** Colony Location ID
	*
	* go type: uint32
	*/
	colonyLocationID: number;
	/** New Level
	*
	* go type: uint32
	*/
	level: number;
}
/** LocationUpgrade Message Structure
 *
 * *	8b --> 12b:	uint32    :	Colony Location ID
 * *	12b --> 16b:	uint32    :	New Level
 */
export const LOCATION_UPGRADE_EVENT: EventSpecification<LocationUpgradeMessageDTO> = {
	id: EventType.LOCATION_UPGRADE,
	name: "LocationUpgrade",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 8,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Colony Location ID",
			fieldName: "colonyLocationID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "New Level",
			fieldName: "level",
			type: GoType.UINT32
		}
	]
}
/**
 * Sent when the owner selects a difficulty (NOT CONFIRM)
 */
export interface DifficultySelectForMinigameMessageDTO extends IMessage {
	/** Colony Location id
	*
	* go type: uint32
	*/
	colonyLocationID: number;
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
 * *	8b --> 12b:	uint32    :	Colony Location id
 * *	12b --> 16b:	uint32    :	Minigame ID
 * *	16b --> 20b:	uint32    :	Difficulty ID
 * *	20b --> +Nb:	string    :	Difficulty Name
 */
export const DIFFICULTY_SELECT_FOR_MINIGAME_EVENT: EventSpecification<DifficultySelectForMinigameMessageDTO> = {
	id: EventType.DIFFICULTY_SELECT_FOR_MINIGAME,
	name: "DifficultySelectForMinigame",
	permissions: {server: false, guest: false, owner: true},
	expectedMinSize: 12,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Colony Location id",
			fieldName: "colonyLocationID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "Minigame ID",
			fieldName: "minigameID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 16,
			description: "Difficulty ID",
			fieldName: "difficultyID",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 20,
			description: "Difficulty Name",
			fieldName: "difficultyName",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the owner confirms a selected difficulty
 */
export interface DifficultyConfirmedForMinigameMessageDTO extends IMessage {
	/** Colony Location id
	*
	* go type: uint32
	*/
	colonyLocationID: number;
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
 * *	8b --> 12b:	uint32    :	Colony Location id
 * *	12b --> 16b:	uint32    :	Minigame ID
 * *	16b --> 20b:	uint32    :	Difficulty ID
 * *	20b --> +Nb:	string    :	Difficulty Name
 */
export const DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT: EventSpecification<DifficultyConfirmedForMinigameMessageDTO> = {
	id: EventType.DIFFICULTY_CONFIRMED_FOR_MINIGAME,
	name: "DifficultyConfirmedForMinigame",
	permissions: {guest: false, owner: true, server: false},
	expectedMinSize: 12,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Colony Location id",
			fieldName: "colonyLocationID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "Minigame ID",
			fieldName: "minigameID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 16,
			description: "Difficulty ID",
			fieldName: "difficultyID",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 20,
			description: "Difficulty Name",
			fieldName: "difficultyName",
			type: GoType.STRING
		}
	]
}
/**
 * sent after the server hasrecieved PLAYER JOIN ACTIVITY or PLAYER ABORTING MINIGAME from all players in the lobby
 */
export interface PlayersDeclareIntentForMinigameMessageDTO extends IMessage {
}
/** PlayersDeclareIntentForMinigame Message Structure
 *
 */
export const PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT: EventSpecification<PlayersDeclareIntentForMinigameMessageDTO> = {
	id: EventType.PLAYERS_DECLARE_INTENT_FOR_MINIGAME,
	name: "PlayersDeclareIntentForMinigame",
	permissions: {owner: false, server: true, guest: false},
	expectedMinSize: 0,
	structure: [
	]
}
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
	name: "PlayerReadyForMinigame",
	permissions: {guest: true, owner: true, server: false},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "Player IGN",
			fieldName: "ign",
			type: GoType.STRING
		}
	]
}
/**
 * sent when a player opts out of the minigame by leaving the hand position check
 */
export interface PlayerAbortingMinigameMessageDTO extends IMessage {
	/** Player ID
	*
	* go type: uint32
	*/
	id: number;
	/** IGN
	*
	* go type: string
	*/
	ign: string;
}
/** PlayerAbortingMinigame Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	IGN
 */
export const PLAYER_ABORTING_MINIGAME_EVENT: EventSpecification<PlayerAbortingMinigameMessageDTO> = {
	id: EventType.PLAYER_ABORTING_MINIGAME,
	name: "PlayerAbortingMinigame",
	permissions: {guest: true, owner: true, server: false},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "IGN",
			fieldName: "ign",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the server has recieved PLAYER READY from all participants
 */
export interface MinigameBeginsMessageDTO extends IMessage {
}
/** MinigameBegins Message Structure
 *
 */
export const MINIGAME_BEGINS_EVENT: EventSpecification<MinigameBeginsMessageDTO> = {
	id: EventType.MINIGAME_BEGINS,
	name: "MinigameBegins",
	permissions: {server: true, guest: false, owner: false},
	expectedMinSize: 0,
	structure: [
	]
}
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
	name: "PlayerJoinActivity",
	permissions: {owner: true, server: false, guest: true},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "Player IGN",
			fieldName: "ign",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when a player fails to load into the minigame
 */
export interface PlayerLoadFailureMessageDTO extends IMessage {
	/** Reason
	*
	* go type: string
	*/
	reason: string;
}
/** PlayerLoadFailure Message Structure
 *
 * *	8b --> +Nb:	string    :	Reason
 */
export const PLAYER_LOAD_FAILURE_EVENT: EventSpecification<PlayerLoadFailureMessageDTO> = {
	id: EventType.PLAYER_LOAD_FAILURE,
	name: "PlayerLoadFailure",
	permissions: {guest: true, owner: true, server: false},
	expectedMinSize: 0,
	structure: [
		{
			byteSize: 0,
			offset: 8,
			description: "Reason",
			fieldName: "reason",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the server has recieved Player Load Failure from any participant
 */
export interface GenericMinigameUntimelyAbortMessageDTO extends IMessage {
	/** ID of source (player or server or other)
	*
	* go type: uint32
	*/
	id: number;
	/** Reason
	*
	* go type: string
	*/
	reason: string;
}
/** GenericMinigameUntimelyAbort Message Structure
 *
 * *	8b --> 12b:	uint32    :	ID of source (player or server or other)
 * *	12b --> +Nb:	string    :	Reason
 */
export const GENERIC_MINIGAME_UNTIMELY_ABORT_EVENT: EventSpecification<GenericMinigameUntimelyAbortMessageDTO> = {
	id: EventType.GENERIC_MINIGAME_UNTIMELY_ABORT,
	name: "GenericMinigameUntimelyAbort",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "ID of source (player or server or other)",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "Reason",
			fieldName: "reason",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when a given player has finished loading into the minigame
 */
export interface PlayerLoadCompleteMessageDTO extends IMessage {
}
/** PlayerLoadComplete Message Structure
 *
 */
export const PLAYER_LOAD_COMPLETE_EVENT: EventSpecification<PlayerLoadCompleteMessageDTO> = {
	id: EventType.PLAYER_LOAD_COMPLETE,
	name: "PlayerLoadComplete",
	permissions: {guest: true, owner: true, server: false},
	expectedMinSize: 0,
	structure: [
	]
}
/**
 * Sent when the server has recieved Player Ready from all participants
 */
export interface LoadMinigameMessageDTO extends IMessage {
}
/** LoadMinigame Message Structure
 *
 */
export const LOAD_MINIGAME_EVENT: EventSpecification<LoadMinigameMessageDTO> = {
	id: EventType.LOAD_MINIGAME,
	name: "LoadMinigame",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 0,
	structure: [
	]
}
/**
 * Sent of any non-fatal reason as result of some other action. Fx. if the owner declines participation
 */
export interface GenericMinigameSequenceResetMessageDTO extends IMessage {
}
/** GenericMinigameSequenceReset Message Structure
 *
 */
export const GENERIC_MINIGAME_SEQUENCE_RESET_EVENT: EventSpecification<GenericMinigameSequenceResetMessageDTO> = {
	id: EventType.GENERIC_MINIGAME_SEQUENCE_RESET,
	name: "GenericMinigameSequenceReset",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 0,
	structure: [
	]
}
/**
 * Sent when the server has determined that the currently ongoing minigame is won
 */
export interface MinigameWonMessageDTO extends IMessage {
	/** Colony Location ID
	*
	* go type: uint32
	*/
	colonyLocationID: number;
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
/** MinigameWon Message Structure
 *
 * *	8b --> 12b:	uint32    :	Colony Location ID
 * *	12b --> 16b:	uint32    :	Minigame ID
 * *	16b --> 20b:	uint32    :	Difficulty ID
 * *	20b --> +Nb:	string    :	Difficulty Name
 */
export const MINIGAME_WON_EVENT: EventSpecification<MinigameWonMessageDTO> = {
	id: EventType.MINIGAME_WON,
	name: "MinigameWon",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 12,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Colony Location ID",
			fieldName: "colonyLocationID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "Minigame ID",
			fieldName: "minigameID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 16,
			description: "Difficulty ID",
			fieldName: "difficultyID",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 20,
			description: "Difficulty Name",
			fieldName: "difficultyName",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the server has determined that the currently ongoing minigame is lost
 */
export interface MinigameLostMessageDTO extends IMessage {
	/** Colony Location ID
	*
	* go type: uint32
	*/
	colonyLocationID: number;
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
/** MinigameLost Message Structure
 *
 * *	8b --> 12b:	uint32    :	Colony Location ID
 * *	12b --> 16b:	uint32    :	Minigame ID
 * *	16b --> 20b:	uint32    :	Difficulty ID
 * *	20b --> +Nb:	string    :	Difficulty Name
 */
export const MINIGAME_LOST_EVENT: EventSpecification<MinigameLostMessageDTO> = {
	id: EventType.MINIGAME_LOST,
	name: "MinigameLost",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 12,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Colony Location ID",
			fieldName: "colonyLocationID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "Minigame ID",
			fieldName: "minigameID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 16,
			description: "Difficulty ID",
			fieldName: "difficultyID",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 20,
			description: "Difficulty Name",
			fieldName: "difficultyName",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the server spawns a new asteroid
 */
export interface AsteroidsAsteroidSpawnMessageDTO extends IMessage {
	/** ID of asteroid
	*
	* go type: uint32
	*/
	id: number;
	/** X Offset, relative 0-1 value to be multiplied with viewport width
	*
	* go type: float32
	*/
	x: number;
	/** Y Offset, relative 0-1 value to be multiplied with viewport height
	*
	* go type: float32
	*/
	y: number;
	/** Asteroid Health
	*
	* go type: uint8
	*/
	health: number;
	/** Time until impact in milliseconds
	*
	* go type: uint32
	*/
	timeUntilImpact: number;
	/** Asteroid Type (not in use)
	*
	* go type: uint8
	*/
	type: number;
	/** Sequence of Letters to be pressed to shoot at this asteroid
	*
	* go type: string
	*/
	charCode: string;
}
/** AsteroidsAsteroidSpawn Message Structure
 *
 * *	8b --> 12b:	uint32    :	ID of asteroid
 * *	12b --> 16b:	float32   :	X Offset, relative 0-1 value to be multiplied with viewport width
 * *	16b --> 20b:	float32   :	Y Offset, relative 0-1 value to be multiplied with viewport height
 * *	20b --> 21b:	uint8     :	Asteroid Health
 * *	21b --> 25b:	uint32    :	Time until impact in milliseconds
 * *	25b --> 26b:	uint8     :	Asteroid Type (not in use)
 * *	26b --> +Nb:	string    :	Sequence of Letters to be pressed to shoot at this asteroid
 */
export const ASTEROIDS_ASTEROID_SPAWN_EVENT: EventSpecification<AsteroidsAsteroidSpawnMessageDTO> = {
	id: EventType.ASTEROIDS_ASTEROID_SPAWN,
	name: "AsteroidsAsteroidSpawn",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 18,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "ID of asteroid",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "X Offset, relative 0-1 value to be multiplied with viewport width",
			fieldName: "x",
			type: GoType.FLOAT32
		},
		{
			byteSize: 4,
			offset: 16,
			description: "Y Offset, relative 0-1 value to be multiplied with viewport height",
			fieldName: "y",
			type: GoType.FLOAT32
		},
		{
			byteSize: 1,
			offset: 20,
			description: "Asteroid Health",
			fieldName: "health",
			type: GoType.UINT8
		},
		{
			byteSize: 4,
			offset: 21,
			description: "Time until impact in milliseconds",
			fieldName: "timeUntilImpact",
			type: GoType.UINT32
		},
		{
			byteSize: 1,
			offset: 25,
			description: "Asteroid Type (not in use)",
			fieldName: "type",
			type: GoType.UINT8
		},
		{
			byteSize: 0,
			offset: 26,
			description: "Sequence of Letters to be pressed to shoot at this asteroid",
			fieldName: "charCode",
			type: GoType.STRING
		}
	]
}
/**
 * Sent to all players when the server has assigned the graphical layout
 */
export interface AsteroidsAssignPlayerDataMessageDTO extends IMessage {
	/** Player ID
	*
	* go type: uint32
	*/
	id: number;
	/** X Position, relative 0-1 value to be multiplied with viewport width
	*
	* go type: float32
	*/
	x: number;
	/** Y Position, relative 0-1 value to be multiplied with viewport height
	*
	* go type: float32
	*/
	y: number;
	/** Tank Type (not in use)
	*
	* go type: uint8
	*/
	type: number;
	/** Sequence of Letters to be pressed to accidentally shoot at this player
	*
	* go type: string
	*/
	code: string;
}
/** AsteroidsAssignPlayerData Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> 16b:	float32   :	X Position, relative 0-1 value to be multiplied with viewport width
 * *	16b --> 20b:	float32   :	Y Position, relative 0-1 value to be multiplied with viewport height
 * *	20b --> 21b:	uint8     :	Tank Type (not in use)
 * *	21b --> +Nb:	string    :	Sequence of Letters to be pressed to accidentally shoot at this player
 */
export const ASTEROIDS_ASSIGN_PLAYER_DATA_EVENT: EventSpecification<AsteroidsAssignPlayerDataMessageDTO> = {
	id: EventType.ASTEROIDS_ASSIGN_PLAYER_DATA,
	name: "AsteroidsAssignPlayerData",
	permissions: {server: true, guest: false, owner: false},
	expectedMinSize: 13,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "X Position, relative 0-1 value to be multiplied with viewport width",
			fieldName: "x",
			type: GoType.FLOAT32
		},
		{
			byteSize: 4,
			offset: 16,
			description: "Y Position, relative 0-1 value to be multiplied with viewport height",
			fieldName: "y",
			type: GoType.FLOAT32
		},
		{
			byteSize: 1,
			offset: 20,
			description: "Tank Type (not in use)",
			fieldName: "type",
			type: GoType.UINT8
		},
		{
			byteSize: 0,
			offset: 21,
			description: "Sequence of Letters to be pressed to accidentally shoot at this player",
			fieldName: "code",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when the server has determined an asteroid has impacted the colony
 */
export interface AsteroidsAsteroidImpactOnColonyMessageDTO extends IMessage {
	/** Asteroid ID
	*
	* go type: uint32
	*/
	id: number;
	/** Health Remaning
	*
	* go type: uint32
	*/
	colonyHPLeft: number;
}
/** AsteroidsAsteroidImpactOnColony Message Structure
 *
 * *	8b --> 12b:	uint32    :	Asteroid ID
 * *	12b --> 16b:	uint32    :	Health Remaning
 */
export const ASTEROIDS_ASTEROID_IMPACT_ON_COLONY_EVENT: EventSpecification<AsteroidsAsteroidImpactOnColonyMessageDTO> = {
	id: EventType.ASTEROIDS_ASTEROID_IMPACT_ON_COLONY,
	name: "AsteroidsAsteroidImpactOnColony",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 8,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Asteroid ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "Health Remaning",
			fieldName: "colonyHPLeft",
			type: GoType.UINT32
		}
	]
}
/**
 * Sent when any player shoots at some char combination (code)
 */
export interface AsteroidsPlayerShootAtCodeMessageDTO extends IMessage {
	/** Player ID
	*
	* go type: uint32
	*/
	id: number;
	/** What char combination the player shot at
	*
	* go type: string
	*/
	code: string;
}
/** AsteroidsPlayerShootAtCode Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> +Nb:	string    :	What char combination the player shot at
 */
export const ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT: EventSpecification<AsteroidsPlayerShootAtCodeMessageDTO> = {
	id: EventType.ASTEROIDS_PLAYER_SHOOT_AT_CODE,
	name: "AsteroidsPlayerShootAtCode",
	permissions: {guest: true, owner: true, server: false},
	expectedMinSize: 4,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "id",
			type: GoType.UINT32
		},
		{
			byteSize: 0,
			offset: 12,
			description: "What char combination the player shot at",
			fieldName: "code",
			type: GoType.STRING
		}
	]
}
/**
 * Sent when a player recieves a timeout
 */
export interface AsteroidsPlayerPenaltyMessageDTO extends IMessage {
	/** Player ID
	*
	* go type: uint32
	*/
	playerID: number;
	/** Penalty duration in seconds
	*
	* go type: float32
	*/
	timeoutDurationS: number;
	/** miss or friendlyFire
	*
	* go type: string
	*/
	type: string;
}
/** AsteroidsPlayerPenalty Message Structure
 *
 * *	8b --> 12b:	uint32    :	Player ID
 * *	12b --> 16b:	float32   :	Penalty duration in seconds
 * *	16b --> +Nb:	string    :	miss or friendlyFire
 */
export const ASTEROIDS_PLAYER_PENALTY_EVENT: EventSpecification<AsteroidsPlayerPenaltyMessageDTO> = {
	id: EventType.ASTEROIDS_PLAYER_PENALTY,
	name: "AsteroidsPlayerPenalty",
	permissions: {guest: false, owner: false, server: true},
	expectedMinSize: 8,
	structure: [
		{
			byteSize: 4,
			offset: 8,
			description: "Player ID",
			fieldName: "playerID",
			type: GoType.UINT32
		},
		{
			byteSize: 4,
			offset: 12,
			description: "Penalty duration in seconds",
			fieldName: "timeoutDurationS",
			type: GoType.FLOAT32
		},
		{
			byteSize: 0,
			offset: 16,
			description: "miss or friendlyFire",
			fieldName: "type",
			type: GoType.STRING
		}
	]
}

export const EVENT_ID_MAP: {[key: number]: EventSpecification<any>} = {
	1: DEBUG_INFO_EVENT,
	2: SERVER_CLOSING_EVENT,
	11: PLAYER_JOINED_EVENT,
	12: PLAYER_LEFT_EVENT,
	13: LOBBY_CLOSING_EVENT,
	1001: ENTER_LOCATION_EVENT,
	1002: PLAYER_MOVE_EVENT,
	1003: LOCATION_UPGRADE_EVENT,
	2000: DIFFICULTY_SELECT_FOR_MINIGAME_EVENT,
	2001: DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT,
	2002: PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT,
	2003: PLAYER_READY_FOR_MINIGAME_EVENT,
	2004: PLAYER_ABORTING_MINIGAME_EVENT,
	2005: MINIGAME_BEGINS_EVENT,
	2006: PLAYER_JOIN_ACTIVITY_EVENT,
	2007: PLAYER_LOAD_FAILURE_EVENT,
	2008: GENERIC_MINIGAME_UNTIMELY_ABORT_EVENT,
	2009: PLAYER_LOAD_COMPLETE_EVENT,
	2010: LOAD_MINIGAME_EVENT,
	2011: GENERIC_MINIGAME_SEQUENCE_RESET_EVENT,
	2012: MINIGAME_WON_EVENT,
	2013: MINIGAME_LOST_EVENT,
	3000: ASTEROIDS_ASTEROID_SPAWN_EVENT,
	3001: ASTEROIDS_ASSIGN_PLAYER_DATA_EVENT,
	3002: ASTEROIDS_ASTEROID_IMPACT_ON_COLONY_EVENT,
	3003: ASTEROIDS_PLAYER_SHOOT_AT_CODE_EVENT,
	3007: ASTEROIDS_PLAYER_PENALTY_EVENT
};

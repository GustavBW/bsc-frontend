import { Component } from "solid-js";
import { IExpandedAccessMultiplexer } from '../integrations/multiplayer_backend/eventMultiplexer';
import {
    DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT,
    PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT,
    PLAYER_READY_FOR_MINIGAME_EVENT,
    PLAYER_ABORTING_MINIGAME_EVENT,
    PLAYER_JOIN_ACTIVITY_EVENT,
    ASTEROIDS_GAME_WON_EVENT,
    ASTEROIDS_GAME_LOST_EVENT,
    DifficultyConfirmedForMinigameMessageDTO,
    IMessage,
} from '../integrations/multiplayer_backend/EventSpecifications';
import { ApplicationContext } from '../meta/types';
import { Minigame, MinigameProps } from "../components/colony/mini_games/minigameLoader";

/**
 * Interface defining the basic operations of the MockServer.
 */
export interface IMockServer {
    start: () => void;
    shutdown: () => void;
}

/**
 * Enum representing different phases of the lobby.
 */
export enum LobbyPhase {
    RoamingColony = 0,
    AwaitingParticipants = 1,
    DeclareIntent = 2,
    InMinigame = 3,
}

/**
 * Constant to represent the server's ID.
 */
export const SERVER_ID: number = Number.MAX_SAFE_INTEGER;

/**
 * MockServer class that simulates the behavior of a game server for minigames.
 * It manages the lobby phases, handles game events, and interacts with the backend.
 */
export class MockServer implements IMockServer {
    private difficultyConfirmed: DifficultyConfirmedForMinigameMessageDTO | null = null;
    private intervalId: NodeJS.Timeout | null = null;
    private readonly subscriptionIDs: number[] = [];
    private readonly messageQueue: IMessage[] = [];
    private lobbyPhase: LobbyPhase = LobbyPhase.RoamingColony;
    private readonly events: IExpandedAccessMultiplexer;
    
    private currentMinigame: Minigame<any> | null = null;
    private minigameSettings: any | null = null;
    private stopGameLoop: (() => void) | null = null;
    private error: string | undefined = undefined;

    /**
     * Constructs a new MockServer instance.
     * @param context The application context containing necessary dependencies.
     */
    constructor(
        private context: ApplicationContext,
    ) {
        this.events = context.events as IExpandedAccessMultiplexer;
    }

    /**
     * Starts the MockServer, initializing subscriptions and starting the update loop.
     */
    public start = () => {
        this.reset();
        this.setupSubscriptions();
        this.intervalId = setInterval(this.update, 100);
    };

    /**
     * Shuts down the MockServer, cleaning up subscriptions and stopping the minigame.
     */
    public shutdown = () => {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
        this.context.events.unsubscribe(...this.subscriptionIDs);
        this.stopMinigame();
    };

    /**
     * Resets the MockServer to its initial state.
     */
    private reset = () => {
        this.stopMinigame();
        this.difficultyConfirmed = null;
        this.messageQueue.length = 0;
        this.lobbyPhase = LobbyPhase.RoamingColony;
        this.error = undefined;
    }

    /**
     * Main update loop of the MockServer. Processes queued messages and manages lobby phases.
     */
    private update = () => {
        if (this.messageQueue.length === 0) return;
        let message: IMessage | undefined;
        while ((message = this.messageQueue.pop()) !== undefined) {
            switch(this.lobbyPhase) {
                case LobbyPhase.RoamingColony: {
                    // Handle difficulty confirmation
                    if (message.eventID === DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT.id) {
                        this.difficultyConfirmed = message as DifficultyConfirmedForMinigameMessageDTO;
                        this.lobbyPhase = LobbyPhase.AwaitingParticipants;
                    }
                    break;
                }
                case LobbyPhase.AwaitingParticipants: {
                    // Handle player joining activity
                    if (message.eventID === PLAYER_JOIN_ACTIVITY_EVENT.id) {
                        this.events.emitRAW({senderID: SERVER_ID, eventID: PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT.id});
                        this.lobbyPhase = LobbyPhase.DeclareIntent;
                    }
                    // Handle player aborting minigame
                    if (message.eventID === PLAYER_ABORTING_MINIGAME_EVENT.id) {
                        this.reset();
                    }
                    break;
                }
                case LobbyPhase.DeclareIntent: {
                    // Handle player ready for minigame
                    if (message.eventID === PLAYER_READY_FOR_MINIGAME_EVENT.id) {
                        this.startMinigame();
                        if (!this.error) {
                            this.lobbyPhase = LobbyPhase.InMinigame;
                        }
                    }
                    break;
                }
                case LobbyPhase.InMinigame: {
                    // Handle game end events
                    if (message.eventID === ASTEROIDS_GAME_WON_EVENT.id || message.eventID === ASTEROIDS_GAME_LOST_EVENT.id) {
                        this.handleGameEnd();
                    }
                    break;
                }
            }
        }
    }

    /**
     * Sets up event subscriptions for the MockServer.
     */
    private setupSubscriptions() {
        const pushToQueue = (e: IMessage) => {
            this.messageQueue.push(e);
        } 

        // Subscribe to various events
        this.subscriptionIDs.push(this.context.events.subscribe(DIFFICULTY_CONFIRMED_FOR_MINIGAME_EVENT, pushToQueue));
        this.subscriptionIDs.push(this.context.events.subscribe(PLAYERS_DECLARE_INTENT_FOR_MINIGAME_EVENT, pushToQueue));
        this.subscriptionIDs.push(this.context.events.subscribe(PLAYER_READY_FOR_MINIGAME_EVENT, pushToQueue));
        this.subscriptionIDs.push(this.context.events.subscribe(PLAYER_ABORTING_MINIGAME_EVENT, pushToQueue));
        this.subscriptionIDs.push(this.context.events.subscribe(PLAYER_JOIN_ACTIVITY_EVENT, pushToQueue));
        this.subscriptionIDs.push(this.context.events.subscribe(ASTEROIDS_GAME_WON_EVENT, pushToQueue));
        this.subscriptionIDs.push(this.context.events.subscribe(ASTEROIDS_GAME_LOST_EVENT, pushToQueue));
    }

    /**
     * Sets the current minigame.
     * @param minigame The minigame to set as the current minigame.
     */
    public setMinigame<T extends object>(minigame: Minigame<T>) {
        this.currentMinigame = minigame;
    }

    /**
     * Fetches minigame settings from the backend.
     * @returns The fetched minigame settings as an object, or null if an error occurred.
     */
    private async fetchMinigameSettings<T extends object>(): Promise<T | null> {
        if (!this.difficultyConfirmed) {
            this.error = "Difficulty not confirmed";
            return null;
        }

        const response = await this.context.backend.getMinimizedMinigameInfo(
            this.difficultyConfirmed.minigameID,
            this.difficultyConfirmed.difficultyID
        );

        if (response.err !== null) {
            this.error = `Error fetching minigame settings: ${response.err}`;
            return null;
        }

        if (!response.res || typeof response.res.settings !== 'string') {
            this.error = "Invalid minigame settings returned";
            return null;
        }

        let parsedSettings: T;
        if (this.isValidJSON(response.res.settings)) {
            parsedSettings = JSON.parse(response.res.settings);
            return parsedSettings;
        } else {
            this.error = "Invalid JSON in minigame settings";
            return null;
        }
    }

    /**
     * Checks if a string is valid JSON.
     * @param str The string to check.
     * @returns True if the string is valid JSON, false otherwise.
     */
    private isValidJSON(str: string): boolean {
        if (typeof str !== 'string') return false;
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Starts the current minigame by fetching settings and initializing the game loop.
     */
    private async startMinigame() {
        if (!this.currentMinigame) {
            this.error = "No minigame set";
            return;
        }

        this.minigameSettings = await this.fetchMinigameSettings();
        if (this.minigameSettings === null) {
            // Error is already set in fetchMinigameSettings
            return;
        }

        this.stopGameLoop = this.currentMinigame.mockServerGameloop(this.minigameSettings);
    }

    /**
     * Stops the current minigame and cleans up related resources.
     */
    private stopMinigame() {
        if (this.stopGameLoop) {
            this.stopGameLoop();
            this.stopGameLoop = null;
        }
        this.currentMinigame = null;
        this.minigameSettings = null;
    }

    /**
     * Handles the end of a game, regardless of win or loss.
     */
    private handleGameEnd() {
        this.stopMinigame();
        this.reset();
        console.log("Game ended");
    }

    /**
     * Gets the top-level component of the current minigame.
     * @returns The minigame component, or null if no minigame is set.
     */
    public getMinigameComponent(): Component<MinigameProps<any>> | null {
        return this.currentMinigame ? this.currentMinigame.topLevelComponent() : null;
    }

    /**
     * Gets the confirmed difficulty for the current minigame.
     * @returns The confirmed difficulty, or null if not set.
     */
    public getDifficultyConfirmed(): DifficultyConfirmedForMinigameMessageDTO | null {
        return this.difficultyConfirmed;
    }

    /**
     * Gets the current minigame settings.
     * @returns The minigame settings, or null if not set.
     */
    public getMinigameSettings(): any | null {
        return this.minigameSettings;
    }

    /**
     * Gets the current error state of the MockServer.
     * @returns The current error message, or undefined if no error.
     */
    public getError(): string | undefined {
        return this.error;
    }
}
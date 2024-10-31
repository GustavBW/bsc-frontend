import { uint32 } from "../../../integrations/main_backend/mainBackendDTOs";
import { IEventMultiplexer } from "../../../integrations/multiplayer_backend/eventMultiplexer";
import { GENERIC_MINIGAME_SEQUENCE_RESET_EVENT, OriginType, PLAYER_ABORTING_MINIGAME_EVENT, PLAYER_JOIN_ACTIVITY_EVENT, PLAYER_JOINED_EVENT, PLAYER_LEFT_EVENT } from "../../../integrations/multiplayer_backend/EventSpecifications";
import { ClientDTO } from "../../../integrations/multiplayer_backend/multiplayerDTO";
import { Logger } from "../../../logging/filteredLogger";
import { ArrayStore, createArrayStore } from "../../../ts/arrayStore";

export enum PlayerParticipation {
    OPT_IN = 'OPT_IN',
    OPT_OUT = 'OPT_OUT',
    UNDECIDED = 'UNDECIDED',
}
export type PlayerMinigameParticipationResponse = {
    id: uint32;
    ign: string;
    participation: PlayerParticipation;
}

export interface TrackedClient extends ClientDTO { 
    participation: PlayerParticipation 
};

class ClientTracker {
    private readonly clients = createArrayStore<TrackedClient>();
    private readonly subIDS: uint32[] = [];
    private readonly log: Logger;
    constructor(
        private readonly events: IEventMultiplexer,
        logger: Logger
    ) {
        this.log = logger.copyFor('tracker');
    }

    public mount = () => {
        const subscribe = this.events.subscribe;
        // Set up event subscriptions
        const playerLeaveSubId = subscribe(PLAYER_LEFT_EVENT, (data) => {
            this.log.info('Player left: ' + data.id);
            this.clients.removeFirst((c) => c.id === data.id);
        });
        this.subIDS.push(playerLeaveSubId);

        const playerJoinSubId = subscribe(PLAYER_JOINED_EVENT, (data) => {
            this.log.info('Player joined: ' + data.id);
            this.clients.add({
                id: data.id,
                IGN: data.ign,
                type: OriginType.Guest,
                state: {
                    lastKnownPosition: -1,
                    msOfLastMessage: 0,
                },
                participation: PlayerParticipation.UNDECIDED,
            });
        });
        this.subIDS.push(playerJoinSubId);

        const resetSequenceSubID = subscribe(GENERIC_MINIGAME_SEQUENCE_RESET_EVENT, (data) => {
            this.clients.mutateByPredicate(
                () => true, 
                c => ({...c, participation: PlayerParticipation.UNDECIDED})
            );
        })
        this.subIDS.push(resetSequenceSubID);

        const playerJoinActivitySubId = subscribe(PLAYER_JOIN_ACTIVITY_EVENT, (data) => {
            this.clients.mutateByPredicate(
                (c) => c.id === data.id,
                (c) => ({ ...c, participation: PlayerParticipation.OPT_IN }),
            );
        })
        this.subIDS.push(playerJoinActivitySubId);

        const playerAbortActivitySubId = subscribe(PLAYER_ABORTING_MINIGAME_EVENT, (data) => {
            this.clients.mutateByPredicate(
                (c) => c.id === data.id,
                (c) => ({ ...c, participation: PlayerParticipation.OPT_OUT }),
            );
        });
        this.subIDS.push(playerAbortActivitySubId);
    }

    public unmount = () => {
        this.events.unsubscribe(...this.subIDS);
    }

    public addClients = (...clients: ClientDTO[]) => {
        for (const client of clients) {
            this.clients.add({
                ...client,
                participation: PlayerParticipation.UNDECIDED,
            });
        }
    }

    public getAsClients = (): ArrayStore<ClientDTO> => {
        return this.clients as unknown as ArrayStore<ClientDTO>;
    }

    public getComponent = () => {

    }
}
export default ClientTracker;
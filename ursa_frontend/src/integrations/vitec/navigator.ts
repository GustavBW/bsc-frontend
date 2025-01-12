import { ENV } from '../../environment/manager';
import { Logger } from '../../logging/filteredLogger';
import { ResErr } from '../../meta/types';
import { ColonyCode, ColonyInfoResponseDTO, PlayerID, PlayerInfoResponseDTO } from '../main_backend/mainBackendDTOs';
import { SubURLs } from './integrationConstants';
import { NormalizedVitecIntegrationInformation, VitecIntegrationInformation } from './vitecDTOs';
import { VitecIntegration } from './vitecIntegration';

/**
 * Handles page navigation and also retaining data during page switches.
 */
export type URSANav = {
    /**
     * Change page to show the colony.
     *
     * Only data passed to this function will be retained.
     */
    goToColony: (colonyID: number, name: string, owner: PlayerID, code?: number) => void;
    /**
     * Change page to show the tutorial.
     *
     * Only data passed to this function will be retained.
     */
    goToTutorial: () => void;
    /**
     * Change page to show the menu.
     *
     * Only data passed to this function will be retained.
     */
    goToMenu: () => void;
    getRetainedUserInfo: () => ResErr<PlayerInfoResponseDTO>;
    getRetainedColonyInfo: () => ResErr<RetainedColonyInfoForPageSwap>;
};

export type RetainedColonyInfoForPageSwap = {
    id: number;
    name: string;
    owner: PlayerID;
    colonyCode?: ColonyCode;
};

export const initNavigator = async (
    vitec: VitecIntegration,
    logger: Logger,
    environment: ENV,
    localPlayer?: PlayerInfoResponseDTO,
): Promise<ResErr<URSANav>> => {
    if (!vitec.info.locationUrl) {
        return { res: null, err: 'Location URL missing' };
    }
    if (!vitec.info.currentSubUrl) {
        return { res: null, err: 'Current sub URL missing' };
    }
    return { res: new UrsaNavImpl(vitec.info, logger, environment, localPlayer), err: null };
};

// Current storage solution: LocalSession storage (not shared between tabs)
const pageSwitchUserInfoKey = 'ursaPageSwitchRetainedUserInfo';
const pageSwitchColonyInfoKey = 'ursaPageSwitchRetainedColonyInfo';

class UrsaNavImpl implements URSANav {
    private readonly localPlayer: PlayerInfoResponseDTO;
    constructor(
        private readonly vitecInfo: NormalizedVitecIntegrationInformation,
        private readonly logger: Logger,
        private readonly environment: ENV,
        player?: PlayerInfoResponseDTO,
    ) {
        if (!player) {
            const userInfoAttempt = this.getRetainedUserInfo();
            if (userInfoAttempt.err) {
                throw new Error('[nav] Failed to retrieve retained user info: ' + userInfoAttempt.err);
            } else {
                this.localPlayer = userInfoAttempt.res;
            }
        } else {
            this.localPlayer = player;
        }
    }
    /**
     * Made as seperate function for type safety.
     */
    private setColonyData = (data: RetainedColonyInfoForPageSwap) => {
        sessionStorage.setItem(pageSwitchColonyInfoKey, JSON.stringify(data));
    };

    goToColony = (colonyID: number, name: string, owner: PlayerID, code?: ColonyCode) => {
        sessionStorage.setItem(pageSwitchUserInfoKey, JSON.stringify(this.localPlayer));
        this.setColonyData({ id: colonyID, name, owner, colonyCode: code });
        this.logger.info('[nav] Navigating to colony');
        window.location.href = this.vitecInfo.locationUrl + this.vitecInfo.commonSubUrl + SubURLs.COLONY;
    };
    goToTutorial = () => {
        sessionStorage.setItem(pageSwitchUserInfoKey, JSON.stringify(this.localPlayer));
        this.logger.info('[nav] Navigating to tutorial');
        window.location.href = this.vitecInfo.locationUrl + this.vitecInfo.commonSubUrl + SubURLs.TUTORIAL;
    };
    goToMenu = () => {
        sessionStorage.setItem(pageSwitchUserInfoKey, JSON.stringify(this.localPlayer));
        this.logger.info('[nav] Navigating to menu');
        window.location.href = this.vitecInfo.locationUrl + this.vitecInfo.commonSubUrl + SubURLs.MENU;
    };
    getRetainedUserInfo = () => {
        const data = sessionStorage.getItem(pageSwitchUserInfoKey);
        const parseAttempt = parseAsJSON(data);
        if (parseAttempt.err) {
            return { res: null, err: 'Error retrieving retained user info: ' + parseAttempt.err };
        }
        return { res: parseAttempt.res, err: null };
    };
    getRetainedColonyInfo = () => {
        const data = sessionStorage.getItem(pageSwitchColonyInfoKey);
        const parseAttempt = parseAsJSON(data);
        if (parseAttempt.err) {
            return { res: null, err: 'Error retrieving retained colony info: ' + parseAttempt.err };
        }
        return { res: parseAttempt.res, err: null };
    };
}

const parseAsJSON = (data: string | null): ResErr<any> => {
    if (!data || data === null) {
        return { res: null, err: 'No data to parse' };
    }
    try {
        return { res: JSON.parse(data), err: null };
    } catch (e) {
        return { res: null, err: 'Failed to parse JSON: ' + e };
    }
};

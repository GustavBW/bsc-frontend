import { Component } from "solid-js";
import { ColonyInfoResponseDTO } from "../../src/integrations/main_backend/mainBackendDTOs";
import { css } from "@emotion/css";
import { IInternationalized } from "../../src/ts/types";

interface ColonyListEntryProps extends IInternationalized {
    colony: ColonyInfoResponseDTO;
    onClick: () => void;
    isSelected: boolean;
}

const ColonyListEntry: Component<ColonyListEntryProps> = (props) => {
    
    const getTimeAgo = (dateString: string) => {

        let visitDateTime: Date;
        visitDateTime = new Date(dateString);

        if (!dateString || isNaN(visitDateTime.getTime())) {
            return props.text.get(dateString).get()
        }

        const now = new Date();

        // Calculate time difference in minutes, hours, days
        const diffMs = now.getTime() - visitDateTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 60) {
            return `${diffMinutes} ${props.text.get("DATA.VISITED.COLONY_MINUTES").get()}`;
        } else if (diffHours < 24) {
            return `${diffHours} ${props.text.get("DATA.VISITED.COLONY_HOURS").get()}`;
        } else {
            return `${diffDays} ${props.text.get("DATA.VISITED.COLONY_DAYS").get()}`;
        }
    };

    return (
        <div 
            class={`${listEntryStyles} ${props.isSelected ? selectedStyles : ''}`}
            onClick={props.onClick}
        >
            <h3>{props.colony.name}</h3>
            <h3>{getTimeAgo(props.colony.latestVisit)}</h3>
            <h3>{props.colony.accLevel}</h3>
        </div>
    )
}

export default ColonyListEntry;

const listEntryStyles = css`
    color: white;
    justify-content: left;
    border: 1px solid white;
    border-radius: 1rem;
    padding: .3rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    gap: .5rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border: 1px solid #00ffff;
        box-shadow: 0 0 10px #00ffff;
    }
`;

const selectedStyles = css`
    background-color: rgba(0, 255, 255, 0.2);
    border: 1px solid #00ffff;
    box-shadow: 0 0 15px #00ffff;

    &:hover {
        background-color: rgba(0, 255, 255, 0.3);
        box-shadow: 0 0 20px #00ffff;
    }
`;
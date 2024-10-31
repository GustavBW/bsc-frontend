import { JSX } from 'solid-js/jsx-runtime';
import BigMenuButton from '../../src/components/base/BigMenuButton';
import { createMemo, createResource, For, Show } from 'solid-js';
import { IBackendBased, IStyleOverwritable } from '../../src/ts/types';
import { AvailableLanguagesResponseDTO, PreferenceKeys } from '../../src/integrations/main_backend/mainBackendDTOs';
import { ResCodeErr } from '../../src/meta/types';
import { css } from '@emotion/css';
import { LanguagePreference } from '../../src/integrations/vitec/vitecDTOs';
import NTAwait from '../../src/components/util/NoThrowAwait';
import { assureUniformLanguageCode } from '../../src/integrations/vitec/vitecIntegration';
import GraphicalAsset from '../../src/components/base/GraphicalAsset';
import SectionSubTitle from '../../src/components/base/SectionSubTitle';
import Spinner from '../../src/components/base/SimpleLoadingSpinner';
import SomethingWentWrongIcon from '../../src/components/base/SomethingWentWrongIcon';
import StarryBackground from '../../src/components/base/StarryBackground';

interface LanguagePageProps extends IBackendBased, IStyleOverwritable {
    onSlideCompleted: () => void;
    onLanguageSelected: (language: LanguagePreference) => void;
}

export default function LanguagePage(props: LanguagePageProps): JSX.Element {
    const [availableLanguages, { mutate, refetch }] = createResource<ResCodeErr<AvailableLanguagesResponseDTO>>(props.backend.getAvailableLanguages);

    const onLanguageSelected = (language: string) => {
        let preference;
        const res = assureUniformLanguageCode(language);
        if (res.err === null) {
            preference = res.res;
            props.onSlideCompleted();
            props.onLanguageSelected(preference);
            props.backend.player.setPreference(PreferenceKeys.LANGUAGE, preference);
        } else {
            preference = LanguagePreference.UNKNOWN;
        }
    };

    return (
        <div class="language-tutorial-page">
            <StarryBackground />
            <Show when={availableLanguages.loading}>
                <Spinner />
            </Show>
            <Show when={availableLanguages.error}>
                <SomethingWentWrongIcon message={availableLanguages.latest?.err} />
            </Show>
            <Show when={availableLanguages.state === 'ready'}>
                <div class={languageListStyle}>
                    <For each={availableLanguages.latest!.res?.languages}>
                        {(language) => (
                            <BigMenuButton onClick={() => onLanguageSelected(language.code)} enable={createMemo(() => language.coverage > 80)}>
                                <SectionSubTitle>{language.commonName}</SectionSubTitle>
                                <NTAwait func={() => props.backend.assets.getMetadata(language.icon)}>
                                    {(metadata) => <GraphicalAsset styleOverwrite={imageOverwrite} metadata={metadata} backend={props.backend} />}
                                </NTAwait>
                            </BigMenuButton>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
}

const imageOverwrite = css`
    width: 100%;
`;

const languageListStyle = css`
    display: grid;
    position: relative;

    left: 50%;
    transform: translateX(-50%);

    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    justify-items: center;
    align-items: center;
    max-height: 20vh;
    width: 80vw;
`;

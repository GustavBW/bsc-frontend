import { Accessor, Component } from 'solid-js';
import { BackendIntegration } from '../mainBackend';
import { Logger } from '../../../logging/filteredLogger';
import { LanguagePreference } from '../../vitec/vitecDTOs';
import { Error, ResErr } from '../../../meta/types';
import { VitecIntegration } from '../../vitec/vitecIntegration';
import { createWrappedSignal, WrappedSignal } from '../../../ts/wrappedSignal';
import I_SectionTitle from './I_SectionTitle';
import I_SectionSubTitle from './I_SectionSubTitle';
import { SubSectionTitleProps } from '../../../components/base/SectionSubTitle';
import { SectionTitleProps } from '../../../components/base/SectionTitle';
import { AvailableLanguagesResponseDTO, TranslationOverviewDTO } from '../mainBackendDTOs';

export interface InternationalizationService {
    Title: (key: string, fallback?: string) => Component<SectionTitleProps>;
    SubTitle: (key: string, fallback?: string) => Component<SectionTitleProps>;

    language: Accessor<LanguagePreference>;
    setLanguage: (lang: LanguagePreference) => void;

    get(key: string): WrappedSignal<string>;
    getAvailableLanguages: () => TranslationOverviewDTO[];
}

class InternationalizationServiceImpl implements InternationalizationService {
    private internalCatalogue: { [key: string]: WrappedSignal<string> } = {};
    constructor(
        private backend: BackendIntegration,
        private log: Logger,
        private currentLanguage: LanguagePreference,
    ) {}

    Title = (key: string, fallback?: string) => {
        let catalogueEntry = this.getOrCreateEntry(key, fallback);
        return (props: SectionTitleProps) => I_SectionTitle({ ...props }, catalogueEntry.get);
    };

    SubTitle = (key: string, fallback?: string) => {
        let catalogueEntry = this.getOrCreateEntry(key, fallback);
        return (props: SubSectionTitleProps) => I_SectionSubTitle({ ...props }, catalogueEntry.get);
    };

    setLanguage = (lang: LanguagePreference): void => {
        if (lang === this.currentLanguage || lang === LanguagePreference.UNKNOWN) {
            return;
        }
        this.loadCatalogue(lang).then((err) => {
            if (err != null) {
                this.log.warn(`Failed to load catalogue for language: ${lang}, error: ${err}`);
            } else {
                this.currentLanguage = lang;
            }
        });
    };

    language = () => this.currentLanguage;

    get = (key: string): WrappedSignal<string> => {
        return this.getOrCreateEntry(key);
    };

    private loadCatalogue = async (lang: LanguagePreference): Promise<Error | undefined> => {
        this.log.trace('Loading catalogue, code: ' + lang);
        const getCataglogueRes = await this.backend.getCatalogue(lang);
        if (getCataglogueRes.err != null) {
            return getCataglogueRes.err;
        }
        const catalogue = getCataglogueRes.res;
        for (const key in catalogue) {
            let value = catalogue[key];
            if (!value || value === '') {
                value = '(' + lang + ') ' + key;
            }
            if (!this.internalCatalogue[key]) {
                this.internalCatalogue[key] = createWrappedSignal(value);
            }
            this.internalCatalogue[key].set(value);
        }
        return undefined;
    };

    private getOrCreateEntry = (key: string, fallback?: string): WrappedSignal<string> => {
        let catalogueEntry = this.internalCatalogue[key];
        if (!catalogueEntry) {
            this.internalCatalogue[key] = createWrappedSignal(fallback ?? key);
            catalogueEntry = this.internalCatalogue[key];
        }
        return catalogueEntry;
    };

    private cachedLanguages: TranslationOverviewDTO[] = [];
    public getAvailableLanguages = (): TranslationOverviewDTO[] => {
        return this.cachedLanguages;
    }

    public async loadInitialCatalogue(): Promise<Error | undefined> {
        const availableLanguages = await this.backend.getAvailableLanguages();
        if (availableLanguages.err != null) {
            return availableLanguages.err;
        }
        this.cachedLanguages = availableLanguages.res.languages;

        return this.loadCatalogue(this.currentLanguage);
    }
}

export const initializeInternationalizationService = async (
    backend: BackendIntegration,
    logger: Logger,
    vitec: VitecIntegration,
): Promise<ResErr<InternationalizationService>> => {
    const log = logger.copyFor('intl');
    log.trace('Initializing internationalization service');

    const intergration = new InternationalizationServiceImpl(backend, log, vitec.info.languagePreference);
    const initErr = await intergration.loadInitialCatalogue();
    if (initErr != null) {
        return { res: null, err: initErr };
    }

    log.trace('Internationalization service initialized');
    return { res: intergration, err: null };
};

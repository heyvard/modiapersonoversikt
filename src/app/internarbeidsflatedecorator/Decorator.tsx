import * as React from 'react';
import { useCallback, useState } from 'react';
import NAVSPA from '@navikt/navspa';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { DecoratorProps, EnhetDisplay, FnrDisplay, RESET_VALUE } from './decoratorprops';
import { fjernBrukerFraPath, paths, setNyBrukerIPath } from '../routes/routing';
import { useHistory, useRouteMatch } from 'react-router';
import './personsokKnapp.less';
import './hurtigtaster.less';
import './decorator.less';
import { useAppState, useOnMount } from '../../utils/customHooks';
import PersonsokContainer from '../personsok/Personsok';
import DecoratorEasterEgg from './EasterEggs/DecoratorEasterEgg';
import { velgEnhetAction } from '../../redux/session/session';
import { useQueryParams } from '../../utils/urlUtils';
import styled from 'styled-components';
import HurtigtastTipsContainer from '../../components/hutigtastTips/HurtigtastTipsContainer';
import useHandleGosysUrl from './useHandleGosysUrl';
import { loggEvent } from '../../utils/logger/frontendLogger';

const InternflateDecorator = NAVSPA.importer<DecoratorProps>('internarbeidsflatefs');
const etterSokefelt = `
<div class="knapper_container">
  <button class="personsok-button" id="toggle-personsok" aria-label="Åpne avansert søk" title="Åpne avansert søk">
    <span> A <span class="personsok-pil"></span></span>
  </button>
  <button class="hurtigtaster-button" id="hurtigtaster-button" aria-label="Åpne hurtigtaster" title="Åpne hurtigtaster">
    <span class="typo-element hurtigtaster-ikon">?<span class="sr-only">Vis hurtigtaster</span></span>
  </button>
</div>
`;

const StyledNav = styled.nav`
    .dekorator .dekorator__container {
        max-width: initial;
    }
`;

function lagConfig(
    fnr: string | null,
    enhet: string | undefined | null,
    history: History,
    settEnhet: (enhet: string) => void
): DecoratorProps {
    const fnrValue = fnr === '0' ? RESET_VALUE : fnr;

    return {
        appname: 'Modia personoversikt',
        fnr: {
            value: fnrValue,
            display: FnrDisplay.SOKEFELT,
            onChange(fnr: string | null): void {
                if (fnr === fnrValue) {
                    return;
                }
                if (fnr && fnr.length > 0) {
                    setNyBrukerIPath(history, fnr);
                } else {
                    fjernBrukerFraPath(history);
                }
            }
        },
        enhet: {
            initialValue: enhet || null,
            display: EnhetDisplay.ENHET_VALG,
            onChange(enhet: string | null): void {
                if (enhet) {
                    settEnhet(enhet);
                }
            }
        },
        toggles: {
            visVeileder: true
        },
        markup: {
            etterSokefelt: etterSokefelt
        }
    };
}

// TODO Jupp, dette er en superhack pga fnr i redux-state ikke blir satt tidlig nok.
// gjeldendeBruker.fnr burde fjernes fra state og hentes fra url slik at man har en single-point-of truth.
function useVenterPaRedux() {
    const [klar, setKlar] = useState(false);
    useOnMount(() => {
        setKlar(true);
    });
    return klar;
}

function useFnrFraUrl(): string | null {
    const queryParams = useQueryParams<{ sokFnr?: string }>();
    const routematch = useRouteMatch<{ fnr: string }>(`${paths.personUri}/:fnr`);
    return queryParams.sokFnr ?? routematch?.params.fnr ?? null;
}

function Decorator() {
    const fnr = useFnrFraUrl();
    const reduxErKlar = useVenterPaRedux();
    const valgtEnhet = useAppState(state => state.session.valgtEnhetId);
    const history = useHistory();
    const dispatch = useDispatch();
    const queryParams = useQueryParams<{ sokFnr?: string }>();

    useHandleGosysUrl();

    useOnMount(() => {
        if (queryParams.sokFnr) {
            loggEvent('Oppslag', 'Puzzle');
        }
    });

    const handleSetEnhet = (enhet: string) => {
        dispatch(velgEnhetAction(enhet));
    };

    const config = useCallback(lagConfig, [fnr, valgtEnhet, history, handleSetEnhet])(
        fnr,
        valgtEnhet,
        history,
        handleSetEnhet
    );

    return (
        <StyledNav>
            {reduxErKlar && (
                <>
                    <InternflateDecorator {...config} />
                    <PersonsokContainer />
                    <HurtigtastTipsContainer />
                    <DecoratorEasterEgg />
                </>
            )}
        </StyledNav>
    );
}

export default Decorator;

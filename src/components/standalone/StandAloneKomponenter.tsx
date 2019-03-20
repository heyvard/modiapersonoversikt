import * as React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import { TabProps } from 'nav-frontend-tabs/lib/tab';
import SaksoversiktLamell from './SaksoversiktLamell';
import { aremark } from '../../mock/person/aremark';
import VisittkortStandAlone from './VisittKort';
import styled from 'styled-components';
import BrukerprofilStandalone from './Brukerprofil';
import UtbetalingsLamell from './UtbetalingsLamell';
import { RouteComponentProps } from 'react-router';
import PleiepengerLamell from './Pleiepenger/PleiepengerLamell';
import HentOppgaveKnappStandalone from './HentOppgaveKnapp';
import SaksoversiktMicroFrontend from '../../app/personside/infotabs/saksoversikt/SaksoversiktMicroFrontend';
import theme from '../../styles/personOversiktTheme';
import { moss } from '../../mock/person/moss';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reducers from '../../redux/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { paths } from '../../app/routes/routing';

enum Komponenter {
    Visittkort,
    Saksoversikt,
    SaksoversiktMCF,
    Brukerprofil,
    Utbetalinger,
    Pleiepenger,
    HentOppgaveKnapp
}

function bareEnumNavn(enumKeys: { label: string }[]) {
    return enumKeys.slice(0, keys.length / 2);
}

const keys = Object.keys(Komponenter);

const tabs: TabProps[] = bareEnumNavn(keys.map(key => ({ label: Komponenter[key] })));

const Style = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: steelblue;
    display: flex;
    flex-direction: column;
    > * {
        flex-shrink: 0;
    }
    > *:first-child {
        background-color: white;
        border-bottom: 0.3rem solid rgba(0, 0, 0, 0.3);
        overflow-x: auto;
    }
`;

const KomponentStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: ${theme.color.bakgrunn};
    margin: 1rem;
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.7);
`;

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

function GjeldendeKomponent(props: { valgtTab: Komponenter; fnr: string }) {
    switch (props.valgtTab) {
        case Komponenter.Saksoversikt:
            return <SaksoversiktLamell fødselsnummer={props.fnr} />;
        case Komponenter.SaksoversiktMCF:
            return (
                <Provider store={store}>
                    <SaksoversiktMicroFrontend
                        fødselsnummer={props.fnr}
                        queryParamString={'sakstemaKode=BAR&journalpostId=ldhlu1bk&dokumentId=6tu2p5mg'}
                    />
                </Provider>
            );
        case Komponenter.Brukerprofil:
            return <BrukerprofilStandalone fødselsnummer={props.fnr} />;
        case Komponenter.Utbetalinger:
            return <UtbetalingsLamell fødselsnummer={props.fnr} />;
        case Komponenter.Pleiepenger:
            return (
                <PleiepengerLamell fødselsnummer={aremark.fødselsnummer} barnetsFødselsnummer={moss.fødselsnummer} />
            );
        case Komponenter.HentOppgaveKnapp:
            return <HentOppgaveKnappStandalone />;
        case Komponenter.Visittkort:
            return <VisittkortStandAlone fødselsnummer={props.fnr} />;
        default:
            return <AlertStripeInfo>Ingenting her</AlertStripeInfo>;
    }
}

function StandAloneKomponenter(props: RouteComponentProps<{ fnr: string; component: string }>) {
    const routeFnr = props.match.params.fnr;
    const fnr = routeFnr || aremark.fødselsnummer;
    const routeComponent = props.match.params.component;
    const valgtTab = Komponenter[routeComponent] || Komponenter.Visittkort;
    const updatePath = (komponent: string) => props.history.push(`${paths.standaloneKomponenter}/${fnr}/${komponent}`);
    return (
        <Style>
            <TabsPure tabs={tabs} onChange={(event, index) => updatePath(Komponenter[index])} />
            <KomponentStyle>
                <GjeldendeKomponent valgtTab={valgtTab} fnr={fnr} />
            </KomponentStyle>
        </Style>
    );
}

export default StandAloneKomponenter;

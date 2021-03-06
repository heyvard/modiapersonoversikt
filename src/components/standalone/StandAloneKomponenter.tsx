import * as React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import { TabProps } from 'nav-frontend-tabs/lib/tab';
import SaksoversiktLamell from './SaksoversiktLamell';
import { aremark } from '../../mock/person/aremark';
import VisittkortStandAlone from './VisittKort';
import styled from 'styled-components/macro';
import BrukerprofilStandalone from './Brukerprofil';
import UtbetalingsLamell from './UtbetalingsLamell';
import { RouteComponentProps } from 'react-router';
import PleiepengerLamell from './Pleiepenger/PleiepengerLamell';
import ForeldrepengerLamell from './Foreldrepenger/ForeldrepengerLamell';
import SakerFullscreen from '../../app/personside/infotabs/saksoversikt/SakerFullscreen';
import theme from '../../styles/personOversiktTheme';
import { moss } from '../../mock/person/moss';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import OppfolgingLamell from './OppfolgingLamell';
import { paths } from '../../app/routes/routing';
import { mapEnumToTabProps } from '../../utils/mapEnumToTabProps';
import SykepengerLamell from './Sykepenger/SykepengerLamell';
import VarslerLamell from './VarslerLamell';
import DialogPanel from '../../app/personside/dialogpanel/DialogPanel';
import JournalforingPanel from '../../app/personside/infotabs/meldinger/traadvisning/verktoylinje/journalforing/JournalforingPanel';
import PersonsokStandAloneKomponent from './PersonsokStandAloneKomponent';
import TidligereMeldinger from '../../app/personside/dialogpanel/fortsettDialog/tidligereMeldinger/TidligereMeldinger';
import { statiskTraadMock } from '../../mock/meldinger/statiskTraadMock';
import BesvarFlere from '../../app/personside/infotabs/meldinger/traadliste/besvarflere/BesvarFlere';
import { getMockTraader } from '../../mock/meldinger/meldinger-mock';
import StandardTekstModal from '../../app/personside/dialogpanel/sendMelding/standardTekster/StandardTekstModal';

enum Komponenter {
    Visittkort,
    Standardtekster,
    Oppfølging,
    Saksoversikt,
    SaksoversiktEgetVindu,
    Brukerprofil,
    Utbetalinger,
    Pleiepenger,
    Foreldrepenger,
    Sykepenger,
    Varsler,
    Dialogpanel,
    Personsok,
    JournalforingPanel,
    TraadVisningDialogpanel,
    BesvarFlere,
    HurtigTasterHjelp,
    OppgaveSkjermetPerson
}

const Style = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: steelblue;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 100vw;
    > *:first-child {
        background-color: white;
        border-bottom: 0.3rem solid rgba(0, 0, 0, 0.3);
        padding: 0.5rem 1rem 0.7rem;
        overflow-x: auto;
    }
`;

const KomponentStyle = styled.div`
    min-height: 0;
    display: flex;
    flex-direction: column;
    background-color: ${theme.color.bakgrunn};
    margin: 1rem;
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.7);
`;

function GjeldendeKomponent(props: { valgtTab: Komponenter; fnr: string }) {
    switch (props.valgtTab) {
        case Komponenter.Saksoversikt:
            return <SaksoversiktLamell fødselsnummer={props.fnr} />;
        case Komponenter.SaksoversiktEgetVindu:
            return <SakerFullscreen fødselsnummer={props.fnr} />;
        case Komponenter.Brukerprofil:
            return <BrukerprofilStandalone fødselsnummer={props.fnr} />;
        case Komponenter.Utbetalinger:
            return <UtbetalingsLamell fødselsnummer={props.fnr} />;
        case Komponenter.Pleiepenger:
            return (
                <PleiepengerLamell fødselsnummer={aremark.fødselsnummer} barnetsFødselsnummer={moss.fødselsnummer} />
            );
        case Komponenter.Foreldrepenger:
            return <ForeldrepengerLamell fødselsnummer={props.fnr} />;
        case Komponenter.Visittkort:
            return <VisittkortStandAlone fødselsnummer={props.fnr} />;
        case Komponenter.Oppfølging:
            return <OppfolgingLamell fødselsnummer={props.fnr} />;
        case Komponenter.Sykepenger:
            return <SykepengerLamell fødselsnummer={aremark.fødselsnummer} sykmeldtFraOgMed="2019-02-06" />;
        case Komponenter.Varsler:
            return <VarslerLamell fødselsnummer={props.fnr} />;
        case Komponenter.Dialogpanel:
            return <DialogPanel />;
        case Komponenter.Personsok:
            return <PersonsokStandAloneKomponent />;
        case Komponenter.JournalforingPanel:
            return <JournalforingPanel lukkPanel={() => null} traad={statiskTraadMock} />;
        case Komponenter.TraadVisningDialogpanel:
            return <TidligereMeldinger traad={statiskTraadMock} />;
        case Komponenter.Standardtekster:
            return <StandardTekstModal appendTekst={tekst => alert(tekst)} />;
        case Komponenter.BesvarFlere:
            return <BesvarFlere traader={getMockTraader(aremark.fødselsnummer).slice(0, 3)} lukkModal={() => null} />;
        default:
            return <AlertStripeInfo>Ingenting her</AlertStripeInfo>;
    }
}

function StandAloneKomponenter(props: RouteComponentProps<{ fnr: string; component: string }>) {
    const routeFnr = props.match.params.fnr;
    const fnr = routeFnr || aremark.fødselsnummer;
    const routeComponent = props.match.params.component;
    const valgtTab = Komponenter[routeComponent] || Komponenter.Visittkort;
    const updatePath = (komponent: string) => props.history.push(`${paths.standaloneKomponenter}/${komponent}/${fnr}`);
    const tabs: TabProps[] = mapEnumToTabProps(Komponenter, valgtTab);

    return (
        <Style>
            <TabsPure kompakt={true} tabs={tabs} onChange={(event, index) => updatePath(Komponenter[index])} />
            <KomponentStyle>
                <GjeldendeKomponent valgtTab={valgtTab} fnr={fnr} />
            </KomponentStyle>
        </Style>
    );
}

export default StandAloneKomponenter;

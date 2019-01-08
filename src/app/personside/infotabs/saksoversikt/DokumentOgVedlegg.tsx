import * as React from 'react';
import { Dokument, DokumentMetadata } from '../../../../models/saksoversikt/dokumentmetadata';
import { TabsPure } from 'nav-frontend-tabs';
import AlertStripeAdvarsel from 'nav-frontend-alertstriper/lib/advarsel-alertstripe';
import styled from 'styled-components';
import theme from '../../../../styles/personOversiktTheme';
import { TabProps } from 'nav-frontend-tabs/lib/tab';
import { getSaksdokument } from '../../../../utils/url-utils';
import { PersonContext } from '../../../App';
import { AppState } from '../../../../redux/reducers';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { settValgtEnkeltdokument, settVisDokument } from '../../../../redux/saksoversikt/actions';
import Lukknapp from 'nav-frontend-lukknapp';

interface StateProps {
    valgtDokument?: DokumentMetadata;
    valgtTab?: Dokument;
    visDokument: boolean;
    erStandaloneVindu: boolean;
}

interface DispatchProps {
    setEnkeltDokument: (valgtDokument: Dokument) => void;
    lukkDokument: () => void;
}

type Props = DispatchProps & StateProps;

const Content = styled.div`
  flex-grow: 1;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  object {
    flex-grow: 1;
  }
`;

const AlertWrapper = styled.div`
  padding: ${theme.margin.px40} ${theme.margin.px10};
`;

const Header = styled.div`
  position: relative;
  padding-right: 10rem;
`;

const KnappWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding-bottom: 0.1rem;
`;

function VisDokumentContainer(props: { fødselsnummer: string, journalpostId: string, dokumentreferanse: string }) {
    const dokUrl = getSaksdokument(props.fødselsnummer, props.journalpostId, props.dokumentreferanse);

    return (
        <object data={dokUrl} width={'100%'}>
            <AlertStripeAdvarsel>Du har ikke tilgang til dokument.</AlertStripeAdvarsel>
        </object>
    );
}

function DokumentOgVedlegg(props: Props) {
    const {valgtDokument, valgtTab} = props;
    if (!valgtDokument || !valgtTab) {
        return (
            <AlertWrapper>
                <AlertStripeAdvarsel>Ingen dokument valgt.</AlertStripeAdvarsel>
            </AlertWrapper>
        );
    }

    const tabs = [valgtDokument.hoveddokument, ...valgtDokument.vedlegg];
    const tabProps: TabProps[] = tabs.map(tab => {
        return {
            label: tab.tittel,
            aktiv: tab === props.valgtTab
        };
    });

    const tabsHeader = props.erStandaloneVindu ?
        null :
        (
            <Header>
                <TabsPure
                    tabs={tabProps}
                    onChange={(event, index) => props.setEnkeltDokument(tabs[index])}
                />
                <KnappWrapper>
                    <Lukknapp ariaLabel={'Lukk dokumentvisning'} onClick={props.lukkDokument}>
                        Lukk dokumentvisning
                    </Lukknapp>
                </KnappWrapper>
            </Header>
        );

    return (
        <Content>
            {tabsHeader}
            <PersonContext.Consumer>{fnr => {
                if (!fnr) {
                    return <AlertStripeAdvarsel>Fødselsnummer ikke satt i ContextProvider</AlertStripeAdvarsel>;
                }
                return (
                    <VisDokumentContainer
                        journalpostId={valgtDokument.journalpostId}
                        dokumentreferanse={valgtTab.dokumentreferanse}
                        fødselsnummer={fnr}
                    />
                );
            }}
            </PersonContext.Consumer>
        </Content>
    );
}

function mapStateToProps(state: AppState): StateProps {
    return ({
        visDokument: state.saksoversikt.visDokument,
        valgtDokument: state.saksoversikt.valgtDokument,
        valgtTab: state.saksoversikt.valgtEnkeltdokument,
        erStandaloneVindu: state.saksoversikt.erStandaloneVindu
    });
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        lukkDokument: () => dispatch(settVisDokument(false)),
        setEnkeltDokument: (enkeltdokument: Dokument) => dispatch(settValgtEnkeltdokument(enkeltdokument))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DokumentOgVedlegg);

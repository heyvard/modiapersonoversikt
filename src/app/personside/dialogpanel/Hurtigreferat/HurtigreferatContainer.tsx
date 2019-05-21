import * as React from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import theme from '../../../../styles/personOversiktTheme';
import styled from 'styled-components';
import { Tekst, tekster } from './tekster';
import HurtigreferatElement from './HurtigreferatElement';
import { connect } from 'react-redux';
import {
    isFailedPosting,
    isFinishedPosting,
    isNotStartedPosting,
    PostResource
} from '../../../../rest/utils/postResource';
import { Meldingstype, SendMeldingRequest } from '../../../../models/meldinger/meldinger';
import { AppState } from '../../../../redux/reducers';
import { sendMeldingActionCreator } from '../../../../redux/restReducers/sendMelding';
import { AlertStripeFeil, AlertStripeInfo } from 'nav-frontend-alertstriper';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { Valg } from './TemaGruppevalg';
import { DeprecatedRestResource } from '../../../../redux/restReducers/deprecatedRestResource';
import { PersonRespons } from '../../../../models/person/person';
import { isLoadedPerson } from '../../../../redux/restReducers/personinformasjon';

interface StateProps {
    sendMeldingResource: PostResource<SendMeldingRequest>;
    person: DeprecatedRestResource<PersonRespons>;
}

interface DispatchProps {
    sendMelding: (tekst: string, temaGruppe: string) => void;
}

type Props = StateProps & DispatchProps;

const Style = styled.div`
    ${theme.resetEkspanderbartPanelStyling};
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.7));
`;

function HurtigreferatContainer(props: Props) {
    const sendResource = props.sendMeldingResource;
    if (isFinishedPosting(sendResource)) {
        return <AlertStripeInfo>Meldingen ble sendt.</AlertStripeInfo>;
    }
    if (isFailedPosting(sendResource)) {
        return (
            <AlertStripeFeil>Det skjedde en feil ved sending av melding: {sendResource.error.message}</AlertStripeFeil>
        );
    }

    const sendMelding = (tekst: string, temagruppe: Valg) => {
        if (isNotStartedPosting(props.sendMeldingResource)) {
            const tekstMedTemagruppe = tekst.replace('TEMA', temagruppe.beskrivelse.toLowerCase());
            props.sendMelding(tekstMedTemagruppe, temagruppe.kodeverk);
        }
    };

    const navn = isLoadedPerson(props.person) ? props.person.data.navn.sammensatt : 'Bruker';
    const teksterMedBrukersNavn: Tekst[] = tekster.map((tekst: Tekst) => ({
        ...tekst,
        fritekst: tekst.fritekst.replace('BRUKER', navn)
    }));
    return (
        <Style>
            <EkspanderbartpanelBase heading={<Undertittel>Hurtigreferat</Undertittel>} ariaTittel={'Hurtigreferat'}>
                <ul>
                    {teksterMedBrukersNavn.map(tekst => (
                        <HurtigreferatElement key={tekst.tittel} tekst={tekst} sendMelding={sendMelding} />
                    ))}
                </ul>
            </EkspanderbartpanelBase>
        </Style>
    );
}

function mapStateToProps(state: AppState): StateProps {
    return {
        sendMeldingResource: state.restResources.sendMelding,
        person: state.restResources.personinformasjon
    };
}

const actionCreators = {
    sendMelding: (tekst: string, temaGruppe: string) =>
        sendMeldingActionCreator({
            fritekst: tekst,
            kanal: 'Telefon',
            type: Meldingstype.SamtalereferatTelefon,
            temagruppe: temaGruppe,
            traadId: null,
            kontorsperretEnhet: null
        })
};

export default connect(
    mapStateToProps,
    actionCreators
)(HurtigreferatContainer);

import * as React from 'react';
import { Melding, Traad } from '../models/meldinger/meldinger';
import { useFødselsnummer } from './customHooks';
import {
    eldsteMelding,
    erJournalfort,
    meldingstittel
} from '../app/personside/infotabs/meldinger/utils/meldingerUtils';
import { Element, Ingress, Normaltekst } from 'nav-frontend-typografi';
import { datoStigende, formatterDatoMedMaanedsnavn } from './dateUtils';
import styled from 'styled-components';
import theme from '../styles/personOversiktTheme';
import { formaterDato } from './stringFormatting';

interface Props {
    valgtTraad: Traad;
}

const StyledTraad = styled.div`
    display: none;
    @media print {
        display: inline-block;
    }
`;

const Topptekst = styled.div`
    margin-bottom: 2rem;
`;

const Flex = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1rem 0rem;
`;

const StyledInnhold = styled.div`
    > * {
        margin-bottom: 1rem !important;
    }
`;

const StyledEnkeltMelding = styled.div`
    margin-bottom: 2rem;
    border-bottom: ${theme.border.skille};
    page-break-inside: avoid;
`;
function EnkeltMeldingMarkup({ melding }: { melding: Melding }) {
    const journalfortDato = erJournalfort(melding) && (
        <Element> Journalført: {melding.journalfortDato && formaterDato(melding.journalfortDato)} </Element>
    );
    const journalfortTema = erJournalfort(melding) && (
        <Element>Journalført med team: {melding.journalfortTemanavn}</Element>
    );
    const fnr = useFødselsnummer();
    const tittel = meldingstittel(melding);
    const temagruppe = melding.temagruppe && <Element>Temagruppe: {melding.temagruppe}</Element>;

    return (
        <StyledEnkeltMelding>
            <Ingress>{tittel}</Ingress>
            <Flex>
                <div>
                    <Element>Type: {melding.meldingstype}</Element>
                    {temagruppe}
                    <Element>Kanal NAV_NO</Element>
                    {journalfortDato}
                    {journalfortTema}
                </div>
                <div>
                    <Element>Fødselsnummer: {fnr}</Element>
                    <Normaltekst>
                        Mottatt/Sendt: {melding.ferdigstiltDato && formaterDato(melding.ferdigstiltDato)}{' '}
                    </Normaltekst>
                </div>
            </Flex>
            <StyledInnhold>
                <Ingress>Innhold:</Ingress>
                <Normaltekst>{melding.fritekst}</Normaltekst>
            </StyledInnhold>
        </StyledEnkeltMelding>
    );
}
export function MeldingerPrintMarkup(props: Props) {
    const melding = eldsteMelding(props.valgtTraad);

    const ferdigstiltUtenSvar = melding.erFerdigstiltUtenSvar && (
        <Normaltekst>
            {' '}
            Henvendelsen er avsluttet uten å svare bruker{' '}
            {melding.ferdigstiltUtenSvarDato && formatterDatoMedMaanedsnavn(melding.ferdigstiltUtenSvarDato)}{' '}
        </Normaltekst>
    );
    const feilsendt = melding.markertSomFeilsendtAv && (
        <Normaltekst> Markert som feilsendt av {melding.markertSomFeilsendtAv.ident}</Normaltekst>
    );
    const kontorsperre = melding.kontorsperretAv && <Element>Kontorsperret for {melding.kontorsperretEnhet}</Element>;
    const enkeltmeldinger = props.valgtTraad.meldinger
        .sort(datoStigende(melding => melding.opprettetDato))
        .map(melding => <EnkeltMeldingMarkup melding={melding} key={melding.id} />);
    return (
        <StyledTraad>
            <Topptekst>
                <Normaltekst>{ferdigstiltUtenSvar}</Normaltekst>
                <Normaltekst>{feilsendt}</Normaltekst>
                <Normaltekst>{kontorsperre}</Normaltekst>
            </Topptekst>
            {enkeltmeldinger}
        </StyledTraad>
    );
}

export default MeldingerPrintMarkup;

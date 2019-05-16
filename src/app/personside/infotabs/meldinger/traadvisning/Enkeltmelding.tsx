import * as React from 'react';
import { LestStatus, Melding, Saksbehandler } from '../../../../../models/meldinger/meldinger';
import Snakkeboble from 'nav-frontend-snakkeboble';
import Element from 'nav-frontend-typografi/lib/element';
import { erMeldingFraNav } from '../utils/meldingerUtils';
import { meldingstypeTekst, temagruppeTekst } from '../utils/meldingstekster';
import { formatterDatoTid } from '../../../../../utils/dateUtils';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import styled from 'styled-components';

interface Props {
    melding: Melding;
}

const Style = styled.div`
    .snakkeboble-panel {
        flex-basis: 70%;
    }
`;

function meldingstittel(melding: Melding) {
    const ulestTekst = melding.status === LestStatus.IkkeLest ? 'Ulest, ' : '';
    return `${meldingstypeTekst(melding.meldingstype)} - ${ulestTekst}${temagruppeTekst(melding.temagruppe)}`;
}

function saksbehandlerTekst(saksbehandler: Saksbehandler) {
    const identTekst = saksbehandler.ident ? `(${saksbehandler.ident})` : '';
    return `${saksbehandler.fornavn} ${saksbehandler.etternavn} ${identTekst}`;
}

function EnkeltMelding(props: Props) {
    const pilHøyre = erMeldingFraNav(props.melding.meldingstype);
    const topptekst = meldingstittel(props.melding);
    const datoTekst = formatterDatoTid(props.melding.opprettetDato);
    const skrevetAv = saksbehandlerTekst(props.melding.skrevetAv);

    return (
        <Style>
            <Snakkeboble pilHoyre={pilHøyre}>
                <Element>{topptekst}</Element>
                <Normaltekst>{datoTekst}</Normaltekst>
                <Normaltekst>Skrevet av: {skrevetAv}</Normaltekst>
                <hr />
                <Normaltekst>{props.melding.fritekst}</Normaltekst>
            </Snakkeboble>
        </Style>
    );
}

export default EnkeltMelding;

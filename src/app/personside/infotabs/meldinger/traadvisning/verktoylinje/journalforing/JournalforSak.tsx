import React, { useState } from 'react';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import styled from 'styled-components';
import { StyledTable } from '../../../../../../../utils/table/StyledTable';
import { JournalforingsSak } from './JournalforingPanel';
import { sakKategori } from './VelgSak';
import { Ingress, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { apiBaseUri } from '../../../../../../../api/config';
import { Traad } from '../../../../../../../models/meldinger/meldinger';
import { post } from '../../../../../../../api/api';
import { loggError } from '../../../../../../../utils/frontendLogger';
import { useSelector } from 'react-redux';
import { fnrSelector } from '../../../../../../../redux/gjeldendeBruker/selectors';

export interface Props {
    sak: JournalforingsSak;
    traad: Traad;
    tilbake: () => void;
    lukkPanel: () => void;
}

const PanelLayout = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
`;

export function JournalforSak(props: Props) {
    const { sak, tilbake, traad, lukkPanel } = props;
    const { traadId } = traad;
    const kategori = sakKategori(sak);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fnr = useSelector(fnrSelector);

    const journalfor = () => {
        setSubmitting(true);
        post(`${apiBaseUri}/journalforing/${fnr}/${traadId}`, sak).then(
            () => {
                setSubmitting(false);
                lukkPanel();
            },
            error => {
                setSubmitting(false);
                setError('Kunne ikke gjennomføre journalføring.');
                loggError(error, `Kunne ikke gjennomføre journalføring.`, { traadId, saksId: sak.saksId });
            }
        );
    };

    return (
        <PanelLayout>
            <Undertittel tag="h1">Journalføring</Undertittel>
            <Normaltekst className="blokk-xs">{kategori}</Normaltekst>

            <Ingress className="blokk-xxxs">{sak.temaNavn}</Ingress>
            <StyledTable
                tittelRekke={['Saksid', 'Opprettet', 'Fagsystem']}
                rows={[[sak.saksId, sak.opprettetDatoFormatert, sak.fagsystemNavn]]}
                className="blokk-m"
            />
            {error && <AlertStripeFeil className="blokk-xs">{error}</AlertStripeFeil>}
            <Hovedknapp className="blokk-xs" onClick={journalfor} spinner={submitting} autoDisableVedSpinner>
                Journalfør
            </Hovedknapp>
            <Flatknapp htmlType="button" onClick={tilbake}>
                Tilbake
            </Flatknapp>
        </PanelLayout>
    );
}
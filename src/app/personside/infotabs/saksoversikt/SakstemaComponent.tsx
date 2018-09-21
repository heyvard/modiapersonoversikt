import * as React from 'react';
import * as moment from 'moment';
import { Behandlingskjede, Behandlingsstatus, Sakstema } from '../../../../models/saksoversikt/sakstema';
import EtikettLiten from 'nav-frontend-typografi/lib/etikett-liten';
import { saksdatoSomDate } from '../../../../models/saksoversikt/fellesSak';
import { DokumentMetadata } from '../../../../models/saksoversikt/dokumentmetadata';
import styled from 'styled-components';
import { theme } from '../../../../styles/personOversiktTheme';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import UndertekstBold from 'nav-frontend-typografi/lib/undertekst-bold';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';

interface Props {
    sakstema: Sakstema;
    oppdaterSakstema: (sakstema: Sakstema) => void;
}

const KnappWrapper = styled.button`
  border: none;
  padding: 0;
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 0.5em;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    background-color: ${theme.color.hoverLink};
  }
  &:focus {
    ${theme.focus}
  }
`;

const Wrapper = styled.div`
    display: flex;
    cursor: pointer;
    &:hover {
      background-color: rgba(102, 203, 236, 0.18);
    }
    > *:first-child {
        flex-grow: 1;
    }
`;

function hentSenesteDatoForDokumenter(dokumentmetadata: DokumentMetadata[]) {
    return dokumentmetadata.reduce(
        (acc: Date, dok: DokumentMetadata) => {
            return acc > saksdatoSomDate(dok.dato) ? acc : saksdatoSomDate(dok.dato);
        },
        new Date(0)
    );
}

function hentSenesteDatoForBehandling(behandlingskjede: Behandlingskjede[]) {
    return behandlingskjede.reduce(
        (acc: Date, kjede: Behandlingskjede) => {
            return acc > saksdatoSomDate(kjede.sistOppdatert) ? acc : saksdatoSomDate(kjede.sistOppdatert);
        },
        new Date(0)
    );
}

function formatterDato(date: Date) {
    return moment(date).format('DD.MM.YYYY [kl.] hh:mm');
}

function hentDatoForSisteHendelse(sakstema: Sakstema) {
    if (sakstema.behandlingskjeder.length > 0 && sakstema.dokumentMetadata.length === 0) {
        return formatterDato(hentSenesteDatoForBehandling(sakstema.behandlingskjeder));
    }
    if (sakstema.behandlingskjeder.length === 0 && sakstema.dokumentMetadata.length > 0) {
        return formatterDato(hentSenesteDatoForDokumenter(sakstema.dokumentMetadata));
    }

    const dateBehandling = hentSenesteDatoForBehandling(sakstema.behandlingskjeder);
    const dateDokumenter = hentSenesteDatoForDokumenter(sakstema.dokumentMetadata);
    return formatterDato(dateBehandling > dateDokumenter ? dateBehandling : dateDokumenter);
}

function tellUnderBehandling(sakstema: Sakstema) {
    const antallUnderbehandling = sakstema.behandlingskjeder
        .filter(behandlingskjede => behandlingskjede.status === Behandlingsstatus.UnderBehandling).length;

    if (antallUnderbehandling === 0) {
        return null;
    }

    const soknad = antallUnderbehandling === 1 ? 'søknad' : 'søknader';
    return <Normaltekst>{antallUnderbehandling} {soknad} er under behandling.</Normaltekst>;
}

function tellFerdigBehandlet(sakstema: Sakstema) {
    const antallFerdigBehandlet = sakstema.behandlingskjeder
        .filter(behandlingskjede => behandlingskjede.status === Behandlingsstatus.FerdigBehandlet).length;

    if (antallFerdigBehandlet === 0) {
        return null;
    }

    const soknad = antallFerdigBehandlet === 1 ? 'søknad' : 'søknader';
    return <Normaltekst>{antallFerdigBehandlet} {soknad} er ferdig behandlet.</Normaltekst>;
}

function SakstemaComponent(props: Props) {
    return (
        <Wrapper onClick={() => props.oppdaterSakstema(props.sakstema)}>
            <div>
                <EtikettLiten>{hentDatoForSisteHendelse(props.sakstema)}</EtikettLiten>
                <UndertekstBold>{props.sakstema.temanavn}</UndertekstBold>
                {tellUnderBehandling(props.sakstema)}
                {tellFerdigBehandlet(props.sakstema)}
            </div>
            <KnappWrapper onClick={() => props.oppdaterSakstema(props.sakstema)}>
                <HoyreChevron/>
            </KnappWrapper>
        </Wrapper>
    );
}

export default SakstemaComponent;
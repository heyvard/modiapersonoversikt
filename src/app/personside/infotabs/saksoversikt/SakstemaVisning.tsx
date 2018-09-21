import * as React from 'react';
import { Behandlingskjede, Sakstema } from '../../../../models/saksoversikt/sakstema';
import styled from 'styled-components';
import theme from '../../../../styles/personOversiktTheme';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import SakstemaComponent from './SakstemaComponent';
import TittelOgIkon from '../../visittkort/body/IkonOgTittel';
import VergemålLogo from '../../../../svg/Utropstegn';
import { DokumentMetadata } from '../../../../models/saksoversikt/dokumentmetadata';
import { Sak } from '../../../../models/saksoversikt/sak';

export interface SakstemaProps {
    sakstema: Sakstema[];
    oppdaterSakstema: (sakstema: Sakstema) => void;
}

const GruppeStyle = styled.li`
  ol > *:first-child {
    padding: 20px 10px 20px 10px;
  }
  ol {
    padding: 0;
    margin: 0;
  }
  ol > *:not(:first-child) {
    border-top: solid 2px ${theme.color.bakgrunn};
    padding: 20px 10px 20px 10px;
  }
`;

const SakstemaListe = styled.ol`
  padding: .2rem ${theme.margin.px10};
  margin: 0;
`;

const Wrapper = styled.div`
  ol {
    list-style: none;
  }
  table {
    width: 100%;
    text-align: right;
    border-spacing: 0;
    * {
      padding: 10px;
      margin: 0;
    }
    tr {
      > * {
        padding: 0.1rem;
        text-align: right;
      }
      > *:first-child {
        text-align: left;
      }
      > *:not(:first-child) {
        width: 6rem;
      }
    }
  }
`;

function GruppertTema(props: SakstemaProps) {
    const sakstemakomponenter = props.sakstema.filter(sakstema => (
        sakstema.behandlingskjeder.length > 0 || sakstema.dokumentMetadata.length > 0)).map(sakstema => (
            <SakstemaComponent sakstema={sakstema} oppdaterSakstema={props.oppdaterSakstema}/>
        )
    );
    return (
        <GruppeStyle>
            <ol>
                {sakstemakomponenter}
            </ol>
        </GruppeStyle>
    );
}

function aggregertSakstema(alleSakstema: Sakstema[]): Sakstema {
    const alleBehandlingskjeder: Behandlingskjede[] = alleSakstema.reduce(
        (acc: Behandlingskjede[], sakstema: Sakstema) => {
            return [...acc, ...sakstema.behandlingskjeder];
        },
        []
    );

    const alleDokumentmetadata: DokumentMetadata[] = alleSakstema.reduce(
        (acc: DokumentMetadata[], sakstema: Sakstema) => {
            return [...acc, ...sakstema.dokumentMetadata];
        },
        []
    );

    const alleTilhørendeSaker: Sak[] = alleSakstema.reduce(
        (acc: Sak[], sakstema: Sakstema) => {
            return [...acc, ...sakstema.tilhorendeSaker];
        },
        []
    );

    return {
        temanavn: 'Alle saker',
        temakode: 'ALLE',
        harTilgang: true,
        behandlingskjeder: alleBehandlingskjeder,
        dokumentMetadata: alleDokumentmetadata,
        tilhorendeSaker: alleTilhørendeSaker,
        erGruppert: false,
        feilkoder: []
    };
}

function SakstemaVisning(props: SakstemaProps) {
    if (props.sakstema.length === 0) {
        return (
            <AlertStripeInfo>
                Det finnes ingen saker for bruker.
            </AlertStripeInfo>
        );
    }

    const alleSakstema = aggregertSakstema(props.sakstema);
    const komplettListe = [alleSakstema, ...props.sakstema];

    return (
        <Wrapper>
            <TittelOgIkon tittel={'SakerVisning'} ikon={<VergemålLogo/>} />
            <SakstemaListe>
                <GruppertTema sakstema={komplettListe} oppdaterSakstema={props.oppdaterSakstema} />
            </SakstemaListe>
        </Wrapper>
    );
}

export default SakstemaVisning;
import * as React from 'react';
import styled from 'styled-components';
import { Fragment } from 'react';

import { Undertekst } from 'nav-frontend-typografi';

import { NavKontor, PublikumsMottak } from '../../../../../models/navkontor';
import { Klokkeslett } from '../../../../../models/klokkeslett';
import EtikettMini from '../../../../../components/EtikettMini';
import VisittkortElement from '../VisittkortElement';

const navLogo = require('./nav-logo.svg');

const NameCase = styled.span`
  text-transform: capitalize;
`;

const StyledLenke = styled.a`
  font-size: 0.9em;
`;

const ApningsTiderListe = styled.dl`
  margin: initial;
  padding: initial;
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  dt {
    flex: 1 1 50%;
  }
  dd {
    flex: 2 2 50%;
    margin: 0;
  }
`;

function padMedNull(streng: string) {
    return streng.length === 1 ? `0${streng}` : streng;
}

function klokkeslettToString(klokkeslett: Klokkeslett) {
    return `${padMedNull(klokkeslett.time)}.${padMedNull(klokkeslett.minutt)}`;
}

function publikumsMottakKontaktInfo(publikumsMottak: PublikumsMottak) {
    const apningstider = publikumsMottak.apningstider.map((apningstid) => (
        <Fragment key={apningstid.ukedag}>
            <dt>
                <Undertekst>
                    <NameCase>
                        {apningstid.ukedag.toLowerCase()}
                    </NameCase>
                </Undertekst>
            </dt>
            <dd>
                <Undertekst>
                    {klokkeslettToString(apningstid.apentFra)} - {klokkeslettToString(apningstid.apentTil)}
                </Undertekst>
            </dd>
        </Fragment>
    ));

    const besoksadresse = publikumsMottak.besoksadresse;

    const adresse = besoksadresse
        ? `
            ${besoksadresse.gatenavn} ${besoksadresse.husnummer || '' }${besoksadresse.husbokstav || ''}`
        : 'Adresse ikke funnet';
    const postSted = besoksadresse ? `${besoksadresse.postnummer} ${besoksadresse.poststed}` : '';

    return (
        <div key={adresse}>
            <br/>
            <EtikettMini>Besøksadresse</EtikettMini>
            <Undertekst>{adresse}</Undertekst>
            <Undertekst>{postSted}</Undertekst>
            <br/>
            <EtikettMini>Åpningstider</EtikettMini>
            <ApningsTiderListe>
                {apningstider}
            </ApningsTiderListe>
            <br/>
        </div>
    );
}

function flerePublikumsmottak(antallMottak: number) {
    if (antallMottak > 1) {
        return (
            <>
                <Undertekst>Det finnes flere publikumsmottak</Undertekst>
                <br/>
            </>
        );
    }
    return null;
}

function Publikumsmottak(props: {publikumsmottak: PublikumsMottak[]}) {
    const antallPublikumsmottak = props.publikumsmottak.length;
    if (antallPublikumsmottak === 0) {
        return <Undertekst>Ingen publikumsmottak</Undertekst>;
    }

    const førstePublikumsmottak = props.publikumsmottak[0];
    return (
        <>
            {publikumsMottakKontaktInfo(førstePublikumsmottak)}
            {flerePublikumsmottak(antallPublikumsmottak)}
        </>
    );
}

function navkontorInfo(navKontor: NavKontor) {
    return (
        <>
            <Publikumsmottak publikumsmottak={navKontor.publikumsmottak}/>
            <StyledLenke
                href={`/norg2-frontend/#/startsok?enhetNr=${navKontor.enhetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={'lenke'}
            >
                Mer informasjon om kontoret
            </StyledLenke>
        </>
    );
}

function NavKontorVisning(props: { navKontor?: NavKontor }) {
    if (!props.navKontor) {
        return (
            <VisittkortElement beskrivelse="Ingen enhet" ikonPath={navLogo}>
                <br/>
            </VisittkortElement>
        );
    }

    const beskrivelse = `${props.navKontor.enhetId} ${props.navKontor.enhetNavn}`;

    return (
        <VisittkortElement beskrivelse={beskrivelse} ikonPath={navLogo}>
            {navkontorInfo(props.navKontor)}
        </VisittkortElement>
    );
}

export default NavKontorVisning;
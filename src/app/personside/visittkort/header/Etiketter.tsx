import * as React from 'react';
import styled from 'styled-components';

import { Person, TilrettelagtKommunikasjon } from '../../../../models/person';
import EtikettBase from 'nav-frontend-etiketter';
import { Diskresjonskoder } from '../../../../konstanter';
import { Egenansatt } from '../../../../models/egenansatt';

interface Props {
    person: Person;
    egenAnsatt?: Egenansatt;
}

const StyledEtikketter = styled.div`
  > * {
    margin: 3px;
  }
`;

function lagDiskresjonskodeEtikett(diskresjonskode: string) {
    switch (diskresjonskode) {
        case Diskresjonskoder.STRENGT_FORTROLIG_ADRESSE:
            return <EtikettBase key={diskresjonskode} type={'advarsel'}>Strengt fortrolig adresse</EtikettBase>;
        case Diskresjonskoder.FORTROLIG_ADRESSE:
            return <EtikettBase key={diskresjonskode} type={'advarsel'}>Fortrolig adresse</EtikettBase>;
        default:
            return <EtikettBase key={diskresjonskode} type={'info'}>{diskresjonskode}</EtikettBase>;
    }
}

function lagEgenAnsattEtikett() {
    return <EtikettBase key={'egenansatt'} type={'advarsel'}>Egen Ansatt</EtikettBase>;
}

function lagTilrettelagtKommunikasjonEtikett(tilrettelagtKommunikasjon: TilrettelagtKommunikasjon) {
    return (
        <EtikettBase key={'tilrettelagtKommunikasjon'} type={'info'}>
            {tilrettelagtKommunikasjon.beskrivelse}
        </EtikettBase>);
}

function lagEtiketter(person: Person, egenAnsatt?: Egenansatt) {
    const etiketter: JSX.Element[]  = [];
    if (person.diskresjonskode) {
        etiketter.push(lagDiskresjonskodeEtikett(person.diskresjonskode));
    }
    if (egenAnsatt && egenAnsatt.erEgenAnsatt) {
        etiketter.push(lagEgenAnsattEtikett());
    }
    person.tilrettelagtKommunikasjonListe.map( tilrettelagtKommunikasjon  =>
        etiketter.push(lagTilrettelagtKommunikasjonEtikett(tilrettelagtKommunikasjon))
    );

    return etiketter;
}

function Etiketter( {person, egenAnsatt}: Props) {
    const etiketter = lagEtiketter(person, egenAnsatt);
    return (
        <StyledEtikketter>
            {etiketter}
        </StyledEtikketter>
    );
}

export default Etiketter;
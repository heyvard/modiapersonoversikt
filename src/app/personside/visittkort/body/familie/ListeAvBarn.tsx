import * as React from 'react';

import VisittkortElement from '../VisittkortElement';
import Undertekst from 'nav-frontend-typografi/lib/undertekst';
import { Familierelasjon, getBarnUnder21, Kjønn } from '../../../../../models/person/person';
import NavnOgAlder from '../../../../../components/person/NavnOgAlder';
import BorMedBruker from '../../../../../components/person/HarSammeBosted';
import { utledKjønnFraFødselsnummer } from '../../../../../utils/fnr-utils';

const jentePath = require('./jentebarn.svg');
const guttePath = require('./guttebarn.svg');

interface Props {
    relasjoner: Familierelasjon[];
}

interface BarnProps {
    barn: Familierelasjon;
}

function Barn({barn}: BarnProps) {
    const kjønn = utledKjønnFraFødselsnummer(barn.tilPerson.fødselsnummer);
    const beskrivelse = kjønn === Kjønn.Kvinne ? 'Jente' : 'Gutt';
    const ikonPath = kjønn === Kjønn.Kvinne ? jentePath : guttePath;
    return (
        <VisittkortElement beskrivelse={beskrivelse} ikonPath={ikonPath}>
            <Undertekst><NavnOgAlder relasjon={barn}/></Undertekst>
            <Undertekst>{barn.tilPerson.fødselsnummer}</Undertekst>
            <Undertekst><BorMedBruker harSammeBosted={barn.harSammeBosted}/></Undertekst>
        </VisittkortElement>
    );
}

function ListeAvBarn({relasjoner}: Props) {
    const barnUnder21 = getBarnUnder21(relasjoner);
    barnUnder21.sort((a, b) => a.tilPerson.alder - b.tilPerson.alder);

    const barn = barnUnder21.map(barnet => <Barn key={barnet.tilPerson.fødselsnummer} barn={barnet}/>);
    return <>{barn}</>;
}

export default ListeAvBarn;
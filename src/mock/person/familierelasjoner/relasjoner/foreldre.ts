import navfaker from 'nav-faker';

import * as DateUtils from '../../../../utils/date-utils';
import { tilfeldigFodselsnummer } from '../../../utils/fnr-utils';
import { getPersonstatus } from '../../personMock';
import { lagNavn, getAlderFromFødselsnummer } from '../../../utils/person-utils';
import { Familierelasjon, Kjønn, Relasjonstype } from '../../../../models/person/person';

export function lagForeldre(barnetsAlder: Date): Familierelasjon[] {
    let foreldre = [];
    if (navfaker.random.vektetSjanse(0.9)) {
        foreldre.push(lagForelder(barnetsAlder, Relasjonstype.Mor));
    }
    if (navfaker.random.vektetSjanse(0.9)) {
        foreldre.push(lagForelder(barnetsAlder, Relasjonstype.Far));
    }
    return foreldre;
}

function lagForelder(barnetsFødselsdato: Date, relasjonstype: Relasjonstype) {
    const kjønn = relasjonstype === Relasjonstype.Mor ? Kjønn.Kvinne : Kjønn.Mann;
    const foreldersFødselsnummer = lagFodselsnummer(barnetsFødselsdato, kjønn);
    const alder = getAlderFromFødselsnummer(foreldersFødselsnummer);
    return {
        harSammeBosted: navfaker.random.vektetSjanse(0.9),
        rolle: relasjonstype,
        tilPerson: {
            navn: lagNavn(foreldersFødselsnummer),
            alder: alder,
            alderMåneder: alder * 12 + 3,
            fødselsnummer: foreldersFødselsnummer,
            personstatus: getPersonstatus(alder)
        }
    };
}

function lagFodselsnummer(barnetsFodselsdato: Date, kjonn: Kjønn) {
    const minFodselsdato = DateUtils.copy(barnetsFodselsdato);
    minFodselsdato.setFullYear(minFodselsdato.getFullYear() - 18);
    const maxFodselsdato = new Date(Date.now());
    maxFodselsdato.setFullYear(maxFodselsdato.getFullYear() - 100);

    const fodselsdato = navfaker.dato.mellom(minFodselsdato, maxFodselsdato);
    return tilfeldigFodselsnummer(fodselsdato, kjonn);
}

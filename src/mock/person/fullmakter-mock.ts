import { Fullmakt } from '../../models/person/fullmakter';
import { fyllRandomListe, vektetSjanse } from '../utils/mock-utils';
import NavFaker from 'nav-faker/dist/navfaker';
import { backendDatoformat } from '../../utils/date-utils';

export function getMockFullmakter(faker: Faker.FakerStatic, navfaker: NavFaker): Fullmakt[] | undefined {
    if (vektetSjanse(faker, 0.5)) {
        return undefined;
    }
    return fyllRandomListe(() => getMockFullmakt(faker, navfaker), 2);
}

function getMockFullmakt(faker: Faker.FakerStatic, navfaker: NavFaker): Fullmakt {
    return {
        motpartsRolle: 'FULLMEKTIG',
        motpartsPersonident: navfaker.personIdentifikator.fødselsnummer(),
        motpartsPersonNavn: navfaker.navn.fornavn(),
        omraade: getOmraade(faker),
        gyldigFraOgMed: backendDatoformat(faker.date.past(1)),
        gyldigTilOgMed: backendDatoformat(faker.date.future(2))
    };
}

function getOmraade(faker: Faker.FakerStatic): string[] {
    if (vektetSjanse(faker, 0.5)) {
        return ['*'];
    } else {
        return ['AAP', 'DAG'];
    }
}

import { vektetSjanse } from '../utils/mock-utils';
import { Sivilstand, SivilstandTyper } from '../../models/person/person';
import { antallArSiden, backendDatoformat } from '../../utils/date-utils';

const ugift = (fraOgMed: string) => {
    return {
        kodeRef: SivilstandTyper.Ugift,
        beskrivelse: 'Ugift',
        fraOgMed
    };
};

const gift = (fraOgMed: string) => {
    return {
        kodeRef: SivilstandTyper.Gift,
        beskrivelse: 'Gift',
        fraOgMed
    };
};

const skilt = (fraOgMed: string) => {
    return {
        kodeRef: SivilstandTyper.Skilt,
        beskrivelse: 'Skilt',
        fraOgMed
    };
};

const samboer = (fraOgMed: string) => {
    return {
        kodeRef: SivilstandTyper.Samboer,
        beskrivelse: 'Samboer',
        fraOgMed
    };
};

const enke = (fraOgMed: string) => {
    return {
        kodeRef: SivilstandTyper.Enke,
        beskrivelse: 'Enke',
        fraOgMed
    };
};

export function getSivilstand(fodselsdato: Date, faker: Faker.FakerStatic): Sivilstand {
    const alder = antallArSiden(fodselsdato);
    const fraOgMed = getSistOppdatert(alder, faker);
    if (alder < 18) {
        return ugift(fraOgMed);
    }
    return getTilfeldigSilvstand(fraOgMed, faker);
}

function getTilfeldigSilvstand(fraOgMed: string, faker: Faker.FakerStatic) {
    if (vektetSjanse(faker, 0.2)) {
        return gift(fraOgMed);
    } else if (vektetSjanse(faker, 0.2)) {
        return skilt(fraOgMed);
    } else if (vektetSjanse(faker, 0.2)) {
        return ugift(fraOgMed);
    } else if (vektetSjanse(faker, 0.2)) {
        return samboer(fraOgMed);
    } else {
        return enke(fraOgMed);
    }
}

function getSistOppdatert(alder: number, faker: Faker.FakerStatic) {
    const maxYearsAgo = alder - 18;
    return backendDatoformat(faker.date.past(maxYearsAgo));
}

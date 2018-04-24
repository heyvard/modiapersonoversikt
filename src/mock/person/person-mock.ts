import * as faker from 'faker/locale/nb_NO';

import { Bankkonto, BostatusTyper, Bostatus, Person } from '../../models/person';
import { Diskresjonskoder } from '../../constants';
import { vektetSjanse } from '../utils';
import * as moment from 'moment';
import { getSivilstand } from './siviltilstandMock';
import {
    Endringsinfo,
    Gateadresse,
    Matrikkeladresse, Periode,
    Personadresse,
    UstrukturertAdresse,
    Utlandsadresse
} from '../../models/personadresse';

function erMann(fødselsnummer: string) {
    return Number(fødselsnummer.charAt(8)) % 2 === 1;
}

export const aremark: Person = {
    fødselsnummer: '10108000398',
    kjønn: 'M',
    geografiskTilknytning: '0118',
    alder: 42,
    navn: {
        sammensatt: 'AREMARK TESTFAMILIEN',
        fornavn: 'AREMARK',
        mellomnavn: '',
        etternavn: 'TESTFAMILIEN',
    },
    diskresjonskode: Diskresjonskoder.FORTROLIG_ADRESSE,
    statsborgerskap: 'NORSK',
    status: {
        dødsdato: undefined,
        bostatus: undefined
    },
    sivilstand: {
        value: 'GIFT',
        beskrivelse: 'Gift'
    }
};

export const bankkontoNorsk: Bankkonto = {
    erNorskKonto: true,
    bank: 'Nordea ASA',
    kontonummer: Number(faker.finance.account(11)),
    sistEndretAv: '1010800 BD03',
    sistEndret: getSistOppdatert(),
};

export const bankkontoUtland: Bankkonto = {
    erNorskKonto: false,
    bank: 'BBVA',
    kontonummer: Number(faker.finance.account(9)),
    sistEndretAv: '1010800 BD03',
    sistEndret: getSistOppdatert(),
};

export const gateadresse: Gateadresse = {
    tilleggsadresse: 'Tillegsgaten 1',
    gatenavn: 'Tilfeldighetsgaten',
    husnummer: '3',
    postnummer: '0666',
    poststed: 'HELL',
    periode: getPeriode()
};

export const matrikkeladresse: Matrikkeladresse = {
   eiendomsnavn: 'Bogstad Gård',
   postnummer: '1234',
   poststed: 'OSLO',
   periode: getPeriode()
};

export const utlandsadresse: Utlandsadresse = {
    landkode: 'BM',
    adresselinje: 'Hytte 2, Stranda, Bahamas',
    periode: getPeriode()
};

export const ustrukturertAdresse: UstrukturertAdresse = {
    adresselinje: 'Storgata 1, 9876 NARVIK'
};

export function getPerson(fødselsnummer: string): Person {
    if (fødselsnummer === aremark.fødselsnummer) {
        return aremark;
    } else {
        faker.seed(Number(fødselsnummer));
        return getTilfeldigPerson(fødselsnummer);
    }
}

function getTilfeldigPerson(fødselsnummer: string): Person {
    const fornavn = getFornavn(fødselsnummer);
    const etternavn = faker.name.lastName();
    const mellomnavn = '';
    const alder = faker.random.number(100);
    return {
        fødselsnummer: fødselsnummer,
        kjønn: erMann(fødselsnummer) ? 'M' : 'K',
        geografiskTilknytning: getGeografiskTilknytning(),
        alder: alder,
        navn: {
            fornavn: fornavn,
            etternavn: etternavn,
            mellomnavn: mellomnavn,
            sammensatt: `${fornavn} ${mellomnavn} ${etternavn}`
        },
        diskresjonskode: getDiskresjonskode(),
        statsborgerskap: getStatsborgerskap(),
        status: getStatus(alder),
        bankkonto: getBankKonto(),
        sivilstand: getSivilstand(alder, faker),
        folkeregistrertAdresse: getTilfeldigAdresse(),
        alternativAdresse: getTilfeldigAdresse(),
        postadresse: getTilfeldigAdresse()
    };
}

function getStatus(alder: number): Bostatus {
    const bostatus = getBostatus();
    const dødsdato = bostatus === BostatusTyper.Død ? faker.date.past(alder).toString() : undefined;
    return {
        bostatus,
        dødsdato
    };
}

function getBostatus() {
    if (vektetSjanse(faker, 0.1)) {
        return BostatusTyper.Død;
    } else if (vektetSjanse(faker, 0.1)) {
        return BostatusTyper.Utvandret;
    } else {
        return undefined;
    }
}

function getBankKonto(): Bankkonto | undefined {
    if (vektetSjanse(faker, 0.7)) {
        return bankkontoNorsk;
    } else if (vektetSjanse(faker, 0.2)) {
        return bankkontoUtland;
    } else {
        return undefined;
    }
}

function getDiskresjonskode() {
    if (vektetSjanse(faker, 0.1)) {
        return Diskresjonskoder.FORTROLIG_ADRESSE;
    } else if (vektetSjanse(faker, 0.1)) {
        return Diskresjonskoder.STRENGT_FORTROLIG_ADRESSE;
    } else {
        return undefined;
    }
}

function getFornavn(fødselsnummer: string): string {
    if (Number(fødselsnummer.charAt(8)) % 2 === 0 ) {
        return faker.name.firstName(1);
    } else {
        return faker.name.firstName(0);
    }
}

function getGeografiskTilknytning() {
    if (vektetSjanse(faker, 0.8)) {
        return String(faker.random.number(9999));
    } else {
        return undefined;
    }
}

function getStatsborgerskap() {
    if (vektetSjanse(faker, 0.7)) {
        return 'NORGE';
    }
    return faker.address.country().toUpperCase();
}

function getSistOppdatert() {
    return moment(faker.date.past(5)).format(moment.ISO_8601.__momentBuiltinFormatBrand);
}

function getTilfeldigAdresse(): Personadresse {
    if (vektetSjanse(faker, 0.2)) {
        return {
            endringsinfo: getEndringsinfo(),
            matrikkeladresse: matrikkeladresse
        };
    } else if (vektetSjanse(faker, 0.2)) {
        return {
            endringsinfo: getEndringsinfo(),
            utlandsadresse: utlandsadresse
        };
    } else if (vektetSjanse(faker, 0.2)) {
        return {
            endringsinfo: getEndringsinfo(),
            ustrukturert: ustrukturertAdresse
        };
    } else {
        return {
            endringsinfo: getEndringsinfo(),
            gateadresse: gateadresse
        };
    }

}

function getEndringsinfo(): Endringsinfo {
    return {
        sistEndret: getSistOppdatert(),
        sistEndretAv: 'AA001'
    };
}

function getPeriode(): Periode {
    return {
        fra: getSistOppdatert(),
        til: getSistOppdatert()
    };
}
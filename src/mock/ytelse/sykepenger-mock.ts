import faker from 'faker/locale/nb_NO';
import navfaker from 'nav-faker/dist/index';

import {
    Forsikring,
    SykepengerResponse,
    Sykmelding,
    Sykepenger,
    Yrkesskade,
    Gradering
} from '../../models/ytelse/sykepenger';
import { getPeriode } from '../person/periodeMock';
import { fyllRandomListe } from '../utils/mock-utils';
import { getKommendeUtbetaling, getUtbetalingPåVent } from './ytelse-utbetalinger-mock';
import { KommendeUtbetaling, UtbetalingPåVent } from '../../models/ytelse/ytelse-utbetalinger';
import { aremark } from '../person/aremark';
import { Arbeidsforhold } from '../../models/ytelse/arbeidsforhold';
import { statiskSykepengerMock } from './statiskSykepengerMock';
import { backendDatoformat } from '../../utils/date-utils';

export function getMockSykepengerRespons(fødselsnummer: string): SykepengerResponse {
    faker.seed(Number(fødselsnummer));
    navfaker.seed(fødselsnummer + 'sykepenger');

    if (fødselsnummer === aremark.fødselsnummer) {
        return {
            sykepenger: [statiskSykepengerMock]
        };
    }

    if (navfaker.random.vektetSjanse(0.3)) {
        return {
            sykepenger: null
        };
    }

    return {
        sykepenger: fyllRandomListe<Sykepenger>(() => getMockSykmepenger(fødselsnummer), 3)
    };
}

export function getMockSykmepenger(fødselsnummer: string): Sykepenger {
    return {
        fødselsnummer: fødselsnummer,
        sykmeldtFom: backendDatoformat(faker.date.past(1)),
        forbrukteDager: navfaker.random.integer(100),
        ferie1: navfaker.random.vektetSjanse(0.3) ? getPeriode() : null,
        ferie2: navfaker.random.vektetSjanse(0.3) ? getPeriode() : null,
        sanksjon: navfaker.random.vektetSjanse(0.3) ? getPeriode() : null,
        stansårsak: navfaker.random.vektetSjanse(0.3) ? 'Svindel og bedrag' : null,
        unntakAktivitet: navfaker.random.vektetSjanse(0.3) ? 'Untatt aktivitet' : null,
        forsikring: navfaker.random.vektetSjanse(0.3) ? getForsikring() : null,
        sykmeldinger: fyllRandomListe<Sykmelding>(() => getMockSykmelding(), 3),
        kommendeUtbetalinger: fyllRandomListe<KommendeUtbetaling>(() => getKommendeUtbetaling(faker), 3, true),
        utbetalingerPåVent: fyllRandomListe<UtbetalingPåVent>(() => getUtbetalingPåVent(faker), 2, true),
        bruker: fødselsnummer,
        midlertidigStanset: navfaker.random.vektetSjanse(0.3) ? backendDatoformat(faker.date.past(1)) : null,
        slutt: navfaker.random.vektetSjanse(0.7) ? null : backendDatoformat(faker.date.past(1)),
        arbeidsforholdListe: fyllRandomListe(() => getArbeidsforhold(), 10, true),
        erArbeidsgiverperiode: navfaker.random.vektetSjanse(0.5),
        arbeidskategori: 'Ærlig arbeid'
    };
}

function getForsikring(): Forsikring {
    return {
        forsikringsordning: faker.lorem.words(1),
        premiegrunnlag: Number(faker.commerce.price()),
        erGyldig: faker.random.boolean(),
        forsikret: navfaker.random.vektetSjanse(0.5) ? getPeriode() : null
    };
}

export function getMockSykmelding(): Sykmelding {
    return {
        sykmelder: faker.name.firstName() + ' ' + faker.name.lastName(),
        behandlet: backendDatoformat(faker.date.past(1)),
        sykmeldt: getPeriode(),
        sykmeldingsgrad: navfaker.random.integer(100),
        gjelderYrkesskade: navfaker.random.vektetSjanse(0.0) ? getYrkesskade() : null,
        gradAvSykmeldingListe: fyllRandomListe(getGradering, 3)
    };
}

function getYrkesskade(): Yrkesskade {
    return {
        yrkesskadeart: faker.lorem.words(3),
        skadet: backendDatoformat(faker.date.past(1)),
        vedtatt: backendDatoformat(faker.date.past(1))
    };
}

function getGradering(): Gradering {
    return {
        gradert: getPeriode(),
        sykmeldingsgrad: navfaker.random.integer(100)
    };
}

function getArbeidsforhold(): Arbeidsforhold {
    return {
        arbeidsgiverNavn: faker.company.companyName(),
        arbeidsgiverKontonr: Number(faker.finance.account(11)).toString(),
        inntektsperiode: 'Månedssats',
        inntektForPerioden: Math.round(Number(faker.finance.amount(5000, 50000))),
        refusjonTom: backendDatoformat(faker.date.past(2)),
        refusjonstype: 'Ikke refusjon',
        sykepengerFom: backendDatoformat(faker.date.past(2))
    };
}

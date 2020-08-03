import * as DateUtils from './date-utils';

const datoer = ['2020-02-08', new Date('2020-02-08'), new Date('2020-02-08T13:37:54.123')];
const datoerMedTid = ['2020-02-08T09:06', '2020-02-08T09:06:04.000', new Date('2020-02-08T09:06:03.003')];
interface MockObject {
    date: string | Date;
}

describe('formaterDato', () => {
    it.each(datoer)('skal formatere %o som dato', dato => {
        expect(DateUtils.formaterDato(dato)).toBe('08.02.2020');
    });
});

describe('formaterDatoMedMaanedsnavn', () => {
    it.each(datoer)('skal formatere %o som dato med månedsnavn', dato => {
        expect(DateUtils.formaterDatoMedMaanedsnavn(dato)).toBe('08. feb. 2020');

        const manedMedKortNavn = DateUtils.copy(dato);
        manedMedKortNavn.setMonth(manedMedKortNavn.getMonth() + 1);
        expect(DateUtils.formaterDatoMedMaanedsnavn(manedMedKortNavn)).toBe('08. mars 2020');
    });
});

describe('formaterDatoTid', () => {
    it.each(datoerMedTid)('skal formatere %o som dato med tid', dato => {
        expect(DateUtils.formaterDatoTid(dato)).toBe('08.02.2020 09:06');
    });
});

describe('formaterDatoTidMedMaanedsnavn', () => {
    it.each(datoerMedTid)('skal formatere %o som dato med månedsnavn og tid', dato => {
        expect(DateUtils.formaterDatoTidMedMaanedsnavn(dato)).toBe('08. feb. 2020 09:06');

        const manedMedKortNavn = DateUtils.copy(dato);
        manedMedKortNavn.setMonth(manedMedKortNavn.getMonth() + 1);
        expect(DateUtils.formaterDatoTidMedMaanedsnavn(manedMedKortNavn)).toBe('08. mars 2020 09:06');
    });
});

describe('datoVerbose', () => {
    it('skal hente riktig dag, måned og år', () => {
        const dato = '1986-12-28T12:00';

        const result = DateUtils.datoVerbose(dato);

        expect(result.sammensatt).toBe('28. Desember 1986');
        expect(result.sammensattMedKlokke).toBe('28. Desember 1986 12:00');
        expect(result.meldingerFormat).toBe('28. Desember 1986, klokken 12:00');
    });
});

describe('isValidDate', () => {
    it('skal validere dato', () => {
        expect(DateUtils.isValidDate('1986-12-28T12:00')).toBe(true);
    });

    it('skal ikke validere dato', () => {
        expect(DateUtils.isValidDate('1986-14-28T12:00')).toBe(false);
    });
});

describe('erMaks10MinSiden', () => {
    it('skal sjekke at dato er mindre enn 10 min siden', () => {
        const dato = new Date(Date.now());
        dato.setMinutes(dato.getMinutes() - 5);

        expect(DateUtils.erMaks10MinSiden(dato)).toBe(true);
    });

    it('skal sjekke at dato er mer enn 10 min siden', () => {
        const dato = new Date(Date.now());
        dato.setMinutes(dato.getMinutes() - 15);

        expect(DateUtils.erMaks10MinSiden(dato)).toBe(false);
    });
});

describe('erMaksEttÅrFramITid', () => {
    it('skal sjekke om dagens dato er innenfor ett år i fremtiden', () => {
        expect(DateUtils.erMaksEttÅrFramITid(new Date(Date.now()))).toBe(true);
    });

    it('skal sjekke at dato i fremtiden ikke er innenfor ett år', () => {
        const date = new Date(Date.now());
        date.setFullYear(date.getFullYear() + 2);

        expect(DateUtils.erMaksEttÅrFramITid(date)).toBe(false);
    });
});

describe('getOldestDate', () => {
    const newDate = new Date(Date.now());
    const oldDate = new Date(Date.now());
    oldDate.setFullYear(oldDate.getFullYear() - 1);
    const testcases = [
        [newDate, oldDate],
        ['2020-07-25', '2019-07-25']
    ];

    it.each(testcases)('skal returnere eldste datoen av %o - %o', (newDate, oldDate) => {
        expect(DateUtils.getOldestDate(newDate, oldDate)).toEqual(oldDate);
        expect(DateUtils.getOldestDate(oldDate, newDate)).toEqual(oldDate);
    });
});

describe('getNewestDate', () => {
    const newDate = new Date(Date.now());
    const oldDate = new Date(Date.now());
    oldDate.setFullYear(oldDate.getFullYear() - 1);
    const testcases = [
        [newDate, oldDate],
        ['2020-07-25', '2019-07-25']
    ];

    it.each(testcases)('skal returnere nyeste datoen av %o - %o', (newDate, oldDate) => {
        expect(DateUtils.getNewestDate(newDate, oldDate)).toEqual(newDate);
        expect(DateUtils.getNewestDate(oldDate, newDate)).toEqual(newDate);
    });
});

describe('ascendingDateComparator', () => {
    it('skal returnere eldste dato først etter sortering', () => {
        const datoA = new Date('2010-01-01');
        const datoB = new Date('2000-01-01');
        const sortedDates = [datoA, datoB].sort(DateUtils.ascendingDateComparator);

        expect(sortedDates[0]).toBe(datoB);
        expect(sortedDates[1]).toBe(datoA);
    });

    it('acendingDateComparator skal returnere differansen mellom datoene', () => {
        const liten = new Date('2000-01-01');
        const liten2 = new Date('2000-01-01');
        const stor = new Date('2000-01-10');

        expect(DateUtils.ascendingDateComparator(stor, liten)).toBeGreaterThan(1);
        expect(DateUtils.ascendingDateComparator(liten, stor)).toBeLessThan(-1);
        expect(DateUtils.ascendingDateComparator(liten, liten2)).toBe(0);
    });
});

describe('datoStigende', () => {
    it('skal returnere eldste dato først etter sortering', () => {
        const datoA: MockObject = { date: '2012-01-01' };
        const datoB: MockObject = { date: new Date('2000-01-01') };
        const sortedDates = [datoA, datoB].sort(DateUtils.datoStigende(object => object.date));

        expect(sortedDates[0]).toBe(datoB);
        expect(sortedDates[1]).toBe(datoA);
    });
});

describe('datoSynkende', () => {
    it('skal returnere nyeste dato først etter sortering', () => {
        const datoA: MockObject = { date: '2012-01-01' };
        const datoB: MockObject = { date: new Date('2000-01-01') };
        const sortedDates = [datoA, datoB].sort(DateUtils.datoSynkende(object => object.date));

        expect(sortedDates[0]).toEqual(datoA);
        expect(sortedDates[1]).toEqual(datoB);
    });
});

describe('antallArSiden', () => {
    const fixedtime = new Date('2020-07-28');
    it('skal kalkulere antall år fra dato', () => {
        expect(DateUtils.antallArSiden(new Date('1999-01-01'), fixedtime)).toBe(21);
        expect(DateUtils.antallArSiden(new Date('2000-01-01'), fixedtime)).toBe(20);
        expect(DateUtils.antallArSiden(new Date('2000-07-28'), fixedtime)).toBe(20);
        expect(DateUtils.antallArSiden(new Date('2000-07-29'), fixedtime)).toBe(19);
        expect(DateUtils.antallArSiden(new Date('2001-01-01'), fixedtime)).toBe(19);
    });
});

describe('backendDatoformat', () => {
    it.each(datoer)('skal formatere %o som dato', dato => {
        expect(DateUtils.backendDatoformat(dato)).toBe('2020-02-08');
    });
});

describe('backendDatoTidformat', () => {
    it.each(datoerMedTid)('skal formatere %o som dato med tid', dato => {
        expect(DateUtils.backendDatoTidformat(dato)).toBe('2020-02-08 09:06');
    });
});

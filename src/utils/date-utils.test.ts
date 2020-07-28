import * as DateUtils from './date-utils';

// @ts-ignore
Date.now = jest.fn(() => new Date()); // for å motvirke Date.now() mock i setupTests.ts
const datoer = ['2020-07-23', new Date('2020-07-23'), new Date('2020-07-23T13:37:54.123')];
const datoerMedTid = ['2020-07-23T13:37', '2020-07-23T13:37:43.000', new Date('2020-07-23T13:37:54.123')];
interface MockObject {
    date: string | Date;
}

console.log('DateDebugging', process.env.TZ, new Date().getTimezoneOffset());

describe('formatterDato', () => {
    it.each(datoer)('skal formatere %o som dato', dato => {
        expect(DateUtils.formatterDato(dato)).toBe('23.07.2020');
    });
});

describe('formatterDatoMedMaanedsnavn', () => {
    it.each(datoer)('skal formatere %o som dato med månedsnavn', dato => {
        expect(DateUtils.formatterDatoMedMaanedsnavn(dato)).toBe('23. juli 2020');
    });
});

describe('formatterDatoTid', () => {
    it.each(datoerMedTid)('skal formatere %o som dato med tid', dato => {
        expect(DateUtils.formatterDatoTid(dato)).toBe('23.07.2020, 13:37');
    });
});

describe('formatterDatoTidMedMaanedsnavn', () => {
    it.each(datoerMedTid)('skal formatere %o som dato med månedsnavn og tid', dato => {
        expect(DateUtils.formatterDatoTidMedMaanedsnavn(dato)).toBe('23. juli 2020, 13:37');
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
        const dato = new Date();
        dato.setMinutes(dato.getMinutes() - 5);

        expect(DateUtils.erMaks10MinSiden(dato)).toBe(true);
    });

    it('skal sjekke at dato er mer enn 10 min siden', () => {
        const dato = new Date();
        dato.setMinutes(dato.getMinutes() - 15);

        expect(DateUtils.erMaks10MinSiden(dato)).toBe(false);
    });
});

describe('erMaksEttÅrFramITid', () => {
    it('skal sjekke om dagens dato er innenfor ett år i fremtiden', () => {
        expect(DateUtils.erMaksEttÅrFramITid(new Date())).toBe(true);
    });

    it('skal sjekke at dato i fremtiden ikke er innenfor ett år', () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 2);

        expect(DateUtils.erMaksEttÅrFramITid(date)).toBe(false);
    });
});

describe('getOldestDate', () => {
    const newDate = new Date();
    const oldDate = new Date();
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
    const newDate = new Date();
    const oldDate = new Date();
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

import { loggError } from './logger/frontendLogger';

const locale = 'nb-NO';
const dateLocaleOptions: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
};
const timeLocaleOptions: Intl.DateTimeFormatOptions = {
    ...dateLocaleOptions,
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: undefined
};

const DATO_FORMAT = new Intl.DateTimeFormat(locale, dateLocaleOptions);
const DATO_FORMAT_MANEDSNAVN = new Intl.DateTimeFormat(locale, { ...dateLocaleOptions, month: 'long' });
const DATO_TID_FORMAT = new Intl.DateTimeFormat(locale, timeLocaleOptions);
const DATO_TID_MANEDSNANV_FORMAT = new Intl.DateTimeFormat(locale, { ...timeLocaleOptions, month: 'long' });
const BARE_MANED = new Intl.DateTimeFormat(locale, { month: 'long' });

export function asDate(dato: string | Date): Date {
    if (dato instanceof Date) {
        return dato;
    }
    return new Date(dato);
}

export function formaterDato(dato: string | Date) {
    return DATO_FORMAT.format(asDate(dato));
}

export function formaterDatoMedMaanedsnavn(datoStr: string | Date) {
    const dato = asDate(datoStr);
    return fiksKortformAvManed(dato, DATO_FORMAT_MANEDSNAVN.format(dato));
}

export function formaterDatoTid(dato: string | Date) {
    return DATO_TID_FORMAT.format(asDate(dato)).replace(',', '');
}

export function formaterDatoTidMedMaanedsnavn(datoStr: string | Date) {
    const dato = asDate(datoStr);
    return fiksKortformAvManed(dato, DATO_TID_MANEDSNANV_FORMAT.format(dato)).replace(',', '');
}

const fiksKortformAvManed = (dato: Date, value: string): string => {
    const maned = BARE_MANED.format(dato);
    if (maned.length <= 4) {
        return value;
    }
    return value.replace(maned, `${maned.substring(0, 3)}.`);
};

const maneder = [
    'Januar',
    'Februar',
    'Mars',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Desember'
];
const manedTilNavnMapping = (manednr: number) => {
    if (manednr < 0 || manednr > 11) {
        return 'N/A';
    }
    return maneder[manednr];
};

export function datoVerbose(dato?: string | Date) {
    const datoMoment = dato ? asDate(dato) : new Date(Date.now());
    const maned = manedTilNavnMapping(datoMoment.getMonth());
    const ar = datoMoment.getFullYear();
    const dag = datoMoment.getDate();
    const klokkeslett = [datoMoment.getHours(), datoMoment.getMinutes()]
        .map(part => part.toString().padStart(2, '0'))
        .join(':');

    return {
        dag: dag,
        måned: maned,
        år: ar,
        sammensatt: `${dag}. ${maned} ${ar}`,
        sammensattMedKlokke: `${dag}. ${maned} ${ar} ${klokkeslett}`,
        meldingerFormat: `${dag}. ${maned} ${ar}, klokken ${klokkeslett}`
    };
}

export function isValidDate(date: string | Date) {
    return asDate(date).toString() !== 'Invalid Date';
}

export function erMaks10MinSiden(datoStr: string | Date) {
    const dato = asDate(datoStr);
    const now = new Date(Date.now()).getTime();
    const tiMinutterSiden = new Date(now - 10 * 60 * 1000);

    return dato > tiMinutterSiden;
}

export function erMaksEttÅrFramITid(datoStr: Date) {
    const dato = asDate(datoStr);
    const ettArIFremtiden = new Date(Date.now());
    ettArIFremtiden.setFullYear(ettArIFremtiden.getFullYear() + 1);

    return dato <= ettArIFremtiden;
}

export function getOldestDate<T extends string | Date>(date1: T, date2: T): T {
    return date1 < date2 ? date1 : date2;
}

export function getNewestDate<T extends string | Date>(date1: T, date2: T): T {
    return date1 >= date2 ? date1 : date2;
}

export function ascendingDateComparator(a: Date | string, b: Date | string): number {
    const dateA = asDate(a);
    const dateB = asDate(b);
    if (!isValidDate(dateA) || !isValidDate(dateB)) {
        loggError(Error('Invalid date in date comparator'), undefined, { datoA: a, datoB: b });
    }
    return +dateA - +dateB;
}

export function datoStigende<T>(getDate: (element: T) => Date | string) {
    return (a: T, b: T): number => ascendingDateComparator(getDate(a), getDate(b));
}

export function datoSynkende<T>(getDate: (element: T) => Date | string) {
    return (a: T, b: T): number => -ascendingDateComparator(getDate(a), getDate(b));
}

export function antallArSiden(date: Date, now: Date = new Date(Date.now())): number {
    return new Date(now.getTime() - date.getTime()).getFullYear() - 1970;
}

export function copy(date: Date): Date {
    return new Date(asDate(date).getTime());
}

export function backendDatoformat(dateStr: string | Date): string {
    const date = asDate(dateStr);
    return [
        date.getFullYear(),
        ('' + (date.getMonth() + 1)).padStart(2, '0'),
        ('' + date.getDate()).padStart(2, '0')
    ].join('-');
}

export function backendDatoTidformat(dateStr: string | Date): string {
    const date = asDate(dateStr);
    const datepart = [
        date.getFullYear(),
        ('' + (date.getMonth() + 1)).padStart(2, '0'),
        ('' + date.getDate()).padStart(2, '0')
    ].join('-');

    const timepart = [('' + date.getHours()).padStart(2, '0'), ('' + date.getMinutes()).padStart(2, '0')].join(':');
    return datepart + ' ' + timepart;
}

export function unix(date: string | Date): number {
    return Math.floor(asDate(date).getTime() / 1000);
}

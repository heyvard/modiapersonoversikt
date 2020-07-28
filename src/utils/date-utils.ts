import { loggError } from './logger/frontendLogger';

export const backendDatoformat: string = 'YYYY-MM-DD';
export const backendDatoTidformat: string = 'YYYY-MM-DD HH:mm';

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

function asDate(dato?: string | Date): Date {
    if (!dato) {
        return new Date();
    }
    if (dato instanceof Date) {
        return dato;
    }
    return new Date(dato);
}

export function formatterDato(dato: string | Date) {
    return DATO_FORMAT.format(asDate(dato));
}

export function formatterDatoMedMaanedsnavn(dato: string | Date) {
    return DATO_FORMAT_MANEDSNAVN.format(asDate(dato));
}

export function formatterDatoTid(dato: string | Date) {
    return DATO_TID_FORMAT.format(asDate(dato));
}

export function formatterDatoTidMedMaanedsnavn(dato: string | Date) {
    return DATO_TID_MANEDSNANV_FORMAT.format(asDate(dato));
}

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
    const datoMoment = asDate(dato);
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
    const now = new Date().getTime();
    const tiMinutterSiden = new Date(now - 10 * 60 * 1000);

    return dato > tiMinutterSiden;
}

export function erMaksEttÅrFramITid(datoStr: Date) {
    const dato = asDate(datoStr);
    const ettArIFremtiden = new Date();
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

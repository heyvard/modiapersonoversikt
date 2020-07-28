import moment from 'moment';
import 'moment/locale/nb';
import { loggError } from './logger/frontendLogger';

export const backendDatoformat: string = 'YYYY-MM-DD';
export const backendDatoTidformat: string = 'YYYY-MM-DD HH:mm';

const DATO_FORMAT = 'DD.MM.YYYY';
const DATO_FORMAT_MANEDSNAVN = 'DD. MMM YYYY';
const DATO_TID_FORMAT = 'DD.MM.YYYY HH:mm';
const DATO_TID_MANEDSNANV_FORMAT = 'DD. MMM YYYY HH:mm';

export function formatterDato(dato: string | Date) {
    return moment(dato).format(DATO_FORMAT);
}

export function formatterDatoMedMaanedsnavn(dato: string | Date) {
    return moment(dato).format(DATO_FORMAT_MANEDSNAVN);
}

export function formatterDatoTid(dato: string | Date) {
    return moment(dato).format(DATO_TID_FORMAT);
}

export function formatterDatoTidMedMaanedsnavn(dato?: string | Date) {
    return moment(dato).format(DATO_TID_MANEDSNANV_FORMAT);
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
    const datoMoment = dato ? moment(dato) : moment();
    const måned = manedTilNavnMapping(datoMoment.month());
    const år = datoMoment.year();
    const dag = datoMoment.date();
    const klokkeslett = datoMoment.format('HH:mm');
    return {
        dag: dag,
        måned: måned,
        år: år,
        sammensatt: `${dag}. ${måned} ${år}`,
        sammensattMedKlokke: `${dag}. ${måned} ${år} ${klokkeslett}`,
        meldingerFormat: `${dag}. ${måned} ${år}, klokken ${klokkeslett}`
    };
}

export function isValidDate(date: string | Date) {
    return moment(date).isValid();
}

export function erImorgenEllerSenere(date: Date) {
    return moment(date).isAfter(new Date(), 'day');
}

export function erMaks10MinSiden(date: string | Date) {
    return moment(date).isAfter(moment().subtract(10, 'minute'));
}

export function erMaksEttÅrFramITid(date: Date) {
    const ettÅrFramITid = moment().add(1, 'years');
    return moment(date).isSameOrBefore(ettÅrFramITid);
}

export function getOldestDate<T extends string | Date>(date1: T, date2: T): T {
    return moment(date1).isBefore(date2) ? date1 : date2;
}

export function getNewestDate<T extends string | Date>(date1: T, date2: T): T {
    return moment(date1).isAfter(date2) ? date1 : date2;
}

export function ascendingDateComparator(a: Date | string, b: Date | string): number {
    const dateA = moment(a);
    const dateB = moment(b);
    if (!dateA.isValid() || !dateB.isValid()) {
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

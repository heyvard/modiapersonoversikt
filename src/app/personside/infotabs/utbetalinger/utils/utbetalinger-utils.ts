import { Skatt, Trekk, Utbetaling, Ytelse, Ytelseskomponent } from '../../../../../models/utbetalinger';
import { Periode } from '../../../../../models/tid';
import { loggError } from '../../../../../utils/logger/frontendLogger';
import { UtbetalingFilterState, PeriodeValg } from '../../../../../redux/utbetalinger/types';
import { datoVerbose, formaterDato, unix } from '../../../../../utils/date-utils';

export const utbetaltTilBruker = 'Bruker';

export function månedOgÅrForUtbetaling(utbetaling: Utbetaling) {
    const verbose = datoVerbose(getGjeldendeDatoForUtbetaling(utbetaling));
    return `${verbose.måned} ${verbose.år}`;
}

export function utbetalingDatoComparator(a: Utbetaling, b: Utbetaling) {
    return unix(getGjeldendeDatoForUtbetaling(b)) - unix(getGjeldendeDatoForUtbetaling(a));
}

export function ytelseBelopDescComparator(a: Ytelseskomponent, b: Ytelseskomponent) {
    return b.ytelseskomponentbeløp - a.ytelseskomponentbeløp;
}

export function skattBelopAscComparator(a: Skatt, b: Skatt) {
    return a.skattebeløp - b.skattebeløp;
}

export function trekkBelopAscComparator(a: Trekk, b: Trekk) {
    return a.trekkbeløp - b.trekkbeløp;
}

export function getUtbetalingerForSiste30DagerDatoer() {
    const fra = new Date(Date.now());
    fra.setDate(fra.getDate() - 30);
    fra.setHours(0, 0, 0, 0);
    const til = new Date(Date.now());
    til.setDate(til.getDate() + 100);
    til.setHours(23, 59, 59, 999);

    return { fra, til };
}

export function getFraDateFromFilter(filter: UtbetalingFilterState): Date {
    switch (filter.periode.radioValg) {
        case PeriodeValg.INNEVÆRENDE_ÅR:
            const iar = new Date(Date.now());
            iar.setMonth(0, 1);
            iar.setHours(0, 0, 0, 0);
            return iar;
        case PeriodeValg.I_FJOR:
            const ifjor = new Date(Date.now());
            ifjor.setFullYear(ifjor.getFullYear() - 1);
            ifjor.setMonth(0, 1);
            ifjor.setHours(0, 0, 0, 0);
            return ifjor;
        case PeriodeValg.EGENDEFINERT:
            return filter.periode.egendefinertPeriode.fra;
        case PeriodeValg.SISTE_30_DAGER:
        default:
            return getUtbetalingerForSiste30DagerDatoer().fra;
    }
}

export function getTilDateFromFilter(filter: UtbetalingFilterState): Date {
    switch (filter.periode.radioValg) {
        case PeriodeValg.I_FJOR:
            const ifjor = new Date(Date.now());
            ifjor.setFullYear(ifjor.getFullYear() - 1);
            ifjor.setMonth(11, 31);
            ifjor.setHours(23, 59, 59, 999);
            return ifjor;
        case PeriodeValg.EGENDEFINERT:
            return filter.periode.egendefinertPeriode.til;
        case PeriodeValg.INNEVÆRENDE_ÅR:
        case PeriodeValg.SISTE_30_DAGER:
        default:
            return getUtbetalingerForSiste30DagerDatoer().til;
    }
}

export function getGjeldendeDatoForUtbetaling(utbetaling: Utbetaling): string {
    return utbetaling.utbetalingsdato || utbetaling.forfallsdato || utbetaling.posteringsdato;
}

export function periodeStringFromYtelse(ytelse: Ytelse): string {
    return ytelse.periode
        ? `${formaterDato(ytelse.periode.start)} - ${formaterDato(ytelse.periode.slutt)}`
        : 'Periode for ytelse ikke funnet';
}

export function getNettoSumYtelser(ytelser: Ytelse[]): number {
    return ytelser.reduce((acc: number, ytelse: Ytelse) => acc + ytelse.nettobeløp, 0);
}

export function getBruttoSumYtelser(ytelser: Ytelse[]): number {
    return ytelser.reduce((acc: number, ytelse: Ytelse) => acc + ytelse.ytelseskomponentersum, 0);
}

export function getTrekkSumYtelser(ytelser: Ytelse[]): number {
    return ytelser.reduce((acc: number, ytelse: Ytelse) => acc + ytelse.skattsum + ytelse.trekksum, 0);
}

export function formaterNOK(beløp: number): string {
    return beløp.toLocaleString('no', { minimumFractionDigits: 2 });
}

export function filtrerBortUtbetalingerSomIkkeErUtbetalt(utbetaling: Utbetaling): boolean {
    return utbetaling.status.toLowerCase() === 'utbetalt';
}

export function summertBeløpStringFraUtbetalinger(
    utbetalinger: Utbetaling[],
    getSumFromYtelser: (ytelser: Ytelse[]) => number
): string {
    try {
        const sum = utbetalinger
            .filter(filtrerBortUtbetalingerSomIkkeErUtbetalt)
            .reduce((acc: number, utbetaling: Utbetaling) => {
                if (!utbetaling.ytelser) {
                    loggError(
                        new Error('Kunne ikke beregne sum på utbetaling'),
                        '"ytelser" er ikke definert på utbetaling, sum må beregnes fra ytelser',
                        { utbetaling: utbetaling }
                    );
                    throw new Error();
                }

                return acc + getSumFromYtelser(utbetaling.ytelser);
            }, 0);

        return formaterNOK(sum);
    } catch (e) {
        return 'Manglende data';
    }
}

export function flatMapYtelser(utbetalinger?: Utbetaling[]): Ytelse[] {
    if (!utbetalinger) {
        return [];
    }
    try {
        const ytelser = utbetalinger.sort(utbetalingDatoComparator).reduce((acc: Ytelse[], utbetaling: Utbetaling) => {
            if (!utbetaling.ytelser) {
                throw new Error('"ytelser" er ikke definert på utbetaling');
            }
            return [...acc, ...utbetaling.ytelser];
        }, []);
        return ytelser;
    } catch (e) {
        console.error('Feil med data i utbetalinger, kunne ikke finne ytelser for alle utbetalinger', e.message);
        return [];
    }
}

export function getPeriodeFromYtelser(ytelser: Ytelse[]): Periode {
    return ytelser.reduce(
        (acc: Periode, ytelse: Ytelse) => {
            if (!ytelse.periode) {
                return acc;
            }

            return {
                fra: new Date(ytelse.periode.start) < new Date(acc.fra) ? ytelse.periode.start : acc.fra,
                til: new Date(ytelse.periode.slutt) >= new Date(acc.til) ? ytelse.periode.slutt : acc.til
            };
        },
        {
            fra: new Date(8640000000000000).toISOString(),
            til: new Date(-8640000000000000).toISOString()
        }
    );
}

export function reduceUtbetlingerTilYtelser(utbetalinger: Utbetaling[]): Ytelse[] {
    return utbetalinger.reduce((acc: Ytelse[], utbetaling: Utbetaling) => {
        if (!utbetaling.ytelser) {
            throw new Error('Utbetaling mangler ytelser');
        }
        return [...acc, ...utbetaling.ytelser];
    }, []);
}

export const getTypeFromYtelse = (ytelse: Ytelse) => ytelse.type || 'Mangler beskrivelse';

export function fjernTommeUtbetalinger(utbetaling: Utbetaling) {
    return utbetaling.ytelser && utbetaling.ytelser.length > 0;
}

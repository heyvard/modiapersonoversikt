import { UtbetalingPåVent } from '../../../../../../models/ytelse/ytelse-utbetalinger';
import { Periode } from '../../../../../../models/tid';

export function utledUtbetalingPåVentÅrsak(utbetaling: UtbetalingPåVent): string {
    if (utbetaling.arbeidskategori === 'Inntektsopplysninger mangler') {
        return utbetaling.arbeidskategori;
    }
    if (utbetaling.stansårsak) {
        return utbetaling.stansårsak;
    }
    if (utbetalingPåVentPgaSanksjon(utbetaling)) {
        return 'Sanksjon';
    }
    if (erPåVentFordiSykemeldingMangler(utbetaling)) {
        return 'Sykmelding mangler for perioden';
    }
    if (erPåVentGrunnetFerie(utbetaling)) {
        return 'Ferie';
    }
    return '';
}

function utbetalingPåVentPgaSanksjon({ vedtak, sanksjon }: UtbetalingPåVent): boolean {
    if (sanksjon && vedtak && vedtak.til) {
        const sanksjonInnenforVedtaksperiode = new Date(sanksjon.fra) <= new Date(vedtak.til);
        const sanksjonUtenSlutt = sanksjonInnenforVedtaksperiode && !sanksjon.til;
        const sanksjonFremdelesGjeldende = !!sanksjon.til && new Date(sanksjon.til) >= new Date(vedtak.til);
        return sanksjonUtenSlutt || sanksjonFremdelesGjeldende;
    }
    return false;
}

function erPåVentFordiSykemeldingMangler({ vedtak, sykmeldt }: UtbetalingPåVent): boolean {
    if (vedtak && sykmeldt && vedtak.til && sykmeldt.til) {
        return new Date(vedtak.til) >= new Date(sykmeldt.til);
    }
    return false;
}

function erPåVentGrunnetFerie({ vedtak, ferie1, ferie2 }: UtbetalingPåVent): boolean {
    if (vedtak) {
        return ferieEtterVedtakTom(ferie1, vedtak.til) || ferieEtterVedtakTom(ferie2, vedtak.til);
    }
    return false;
}

function ferieEtterVedtakTom(ferie: Periode | null, vedtakTil: string): boolean {
    return !!ferie && new Date(vedtakTil) <= new Date(ferie.til);
}

import { Melding, Meldingstype, Saksbehandler, Temagruppe, Traad } from '../../../../../models/meldinger/meldinger';
import { meldingstypeTekst, temagruppeTekst } from './meldingstekster';
import { datoStigende, datoSynkende } from '../../../../../utils/dateUtils';
import { useMemo } from 'react';
import useDebounce from '../../../../../utils/hooks/use-debounce';

export function sisteSendteMelding(traad: Traad) {
    return [...traad.meldinger].sort(datoSynkende(melding => melding.opprettetDato))[0];
}

export function eldsteMelding(traad: Traad) {
    return [...traad.meldinger].sort(datoStigende(melding => melding.opprettetDato))[0];
}

export function erMonolog(traad: Traad) {
    const bareSaksbehandler: boolean = traad.meldinger.some(melding => erMeldingFraNav(melding.meldingstype));
    const bareBruker: boolean = traad.meldinger.some(melding => erMeldingFraBruker(melding.meldingstype));

    return bareSaksbehandler !== bareBruker;
}

export function meldingstittel(melding: Melding) {
    return `${meldingstypeTekst(melding.meldingstype)} - ${temagruppeTekst(melding.temagruppe)}`;
}

export function getTemagruppeForTraader(traader: Traad[]) {
    return traader[0].meldinger[0].temagruppe.toString();
}

export function erSamtalereferat(temagruppe: Temagruppe) {
    return [
        Temagruppe.Arbeid,
        Temagruppe.Familie,
        Temagruppe.Hjelpemiddel,
        Temagruppe.Pensjon,
        Temagruppe.Øvrig,
        Temagruppe.ØkonomiskSosial,
        Temagruppe.AndreSosiale
    ].includes(temagruppe);
}

export function kanLeggesTilbake(temagruppe: Temagruppe) {
    return [
        Temagruppe.Arbeid,
        Temagruppe.Familie,
        Temagruppe.Hjelpemiddel,
        Temagruppe.Bil,
        Temagruppe.OrtopediskHjelpemiddel,
        Temagruppe.PleiepengerBarnsSykdom,
        Temagruppe.Uføretrygd,
        Temagruppe.Utland,
        Temagruppe.ØkonomiskSosial,
        Temagruppe.AndreSosiale
    ].includes(temagruppe);
}

export function erPlukkbar(temagruppe: Temagruppe) {
    return [
        Temagruppe.Arbeid,
        Temagruppe.Familie,
        Temagruppe.Hjelpemiddel,
        Temagruppe.Bil,
        Temagruppe.OrtopediskHjelpemiddel,
        Temagruppe.PleiepengerBarnsSykdom,
        Temagruppe.Uføretrygd,
        Temagruppe.Utland
    ].includes(temagruppe);
}

export function erKommunaleTjenester(temagruppe: Temagruppe) {
    return [Temagruppe.ØkonomiskSosial, Temagruppe.AndreSosiale].includes(temagruppe);
}

export function erMeldingFraBruker(meldingstype: Meldingstype) {
    return [Meldingstype.SPORSMAL_SKRIFTLIG, Meldingstype.SvarSblInngående].includes(meldingstype);
}

export function erMeldingFraNav(meldingstype: Meldingstype) {
    return [
        Meldingstype.SVAR_SKRIFTLIG,
        Meldingstype.SVAR_OPPMOTE,
        Meldingstype.SVAR_TELEFON,
        Meldingstype.SAMTALEREFERAT_TELEFON,
        Meldingstype.SAMTALEREFERAT_OPPMOTE,
        Meldingstype.SPORSMAL_MODIA_UTGAAENDE,
        Meldingstype.DOKUMENT_VARSEL,
        Meldingstype.OPPGAVE_VARSEL,
        Meldingstype.DELVIS_SVAR_SKRIFTLIG
    ].includes(meldingstype);
}

export function erMeldingVarsel(meldingstype: Meldingstype) {
    return [Meldingstype.OPPGAVE_VARSEL, Meldingstype.DOKUMENT_VARSEL].includes(meldingstype);
}

export function erMeldingSpørsmål(meldingstype: Meldingstype) {
    return [Meldingstype.SPORSMAL_MODIA_UTGAAENDE, Meldingstype.SPORSMAL_SKRIFTLIG].includes(meldingstype);
}

export function erKontorsperret(traad: Traad): boolean {
    return !!eldsteMelding(traad).kontorsperretEnhet;
}

export function erEldsteMeldingJournalfort(traad: Traad): boolean {
    return erJournalfort(eldsteMelding(traad));
}

export function erJournalfort(melding: Melding) {
    return !!melding.journalfortDato;
}

export function erFeilsendt(traad: Traad): boolean {
    return !!eldsteMelding(traad).markertSomFeilsendtAv;
}

export function erMeldingFeilsendt(melding: Melding): boolean {
    return !!melding.markertSomFeilsendtAv;
}

export function erBehandlet(traad: Traad): boolean {
    const minstEnMeldingErFraNav: boolean = traad.meldinger.some(melding => erMeldingFraNav(melding.meldingstype));
    const erFerdigstiltUtenSvar: boolean = eldsteMelding(traad).erFerdigstiltUtenSvar;

    return minstEnMeldingErFraNav || erFerdigstiltUtenSvar;
}

export function harDelsvar(traad: Traad): boolean {
    return traad.meldinger.some(melding => melding.meldingstype === Meldingstype.DELVIS_SVAR_SKRIFTLIG);
}

export function harTilgangTilSletting() {
    // TODO Fiks når vi har satt opp vault/fasit
    return true;
}

export function saksbehandlerTekst(saksbehandler?: Saksbehandler) {
    if (!saksbehandler) {
        return 'Ukjent saksbehandler';
    }
    const identTekst = saksbehandler.ident ? `(${saksbehandler.ident})` : '';
    return `${saksbehandler.fornavn} ${saksbehandler.etternavn} ${identTekst}`;
}

export function useSokEtterMeldinger(traader: Traad[], query: string) {
    const debouncedQuery = useDebounce(query, 200);
    return useMemo(() => {
        const words = debouncedQuery.split(' ');
        return traader
            .filter(traad => {
                return traad.meldinger.some(melding => {
                    const fritekst = melding.fritekst;
                    const tittel = meldingstittel(melding);
                    const saksbehandler = saksbehandlerTekst(melding.skrevetAv);
                    const sokbarTekst = (fritekst + tittel + saksbehandler).toLowerCase();
                    return words.every(word => sokbarTekst.includes(word.toLowerCase()));
                });
            })
            .sort(datoSynkende(traad => sisteSendteMelding(traad).opprettetDato));
    }, [debouncedQuery, traader]);
}

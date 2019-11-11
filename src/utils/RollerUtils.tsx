import { VeilederRoller } from '../models/veilederRoller';

export enum SaksbehandlerRoller {
    EndreKontonummer = '0000-GA-BD06_EndreKontonummer',
    EndreKontaktAdresse = '0000-GA-BD06_EndreKontaktAdresse',
    EndreNavn = '0000-GA-BD06_EndreNavn',
    HentOppgave = '0000-GA-BD06_HentOppgave'
}

export function veilederHarPåkrevdRolleForEndreNavn(veiledersRoller: VeilederRoller) {
    return veiledersRoller.roller.includes(SaksbehandlerRoller.EndreNavn);
}

export function veilederHarPåkrevdRolleForEndreAdresse(veiledersRoller: VeilederRoller) {
    return veiledersRoller.roller.includes(SaksbehandlerRoller.EndreKontaktAdresse);
}

export function veilederHarPåkrevdRolleForEndreKontonummer(veiledersRoller: VeilederRoller) {
    return veiledersRoller.roller.includes(SaksbehandlerRoller.EndreKontonummer);
}
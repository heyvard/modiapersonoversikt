import * as Cookies from 'js-cookie';

const kontrollSpmErLukketForBrukerCookieNavn = 'KontrollSpmErLukketForBruker';

export function settSkjulKontrollspørsmålPåTversAvVinduerForBrukerCookie(fnr: string) {
    const omEnTime = new Date(Date.now());
    omEnTime.setHours(omEnTime.getHours() + 1);
    Cookies.set(kontrollSpmErLukketForBrukerCookieNavn, fnr, { expires: omEnTime });
}

export function kontrollspørsmålHarBlittLukketForBruker(fnr: string): boolean {
    const cookie = Cookies.get(kontrollSpmErLukketForBrukerCookieNavn);
    if (cookie && cookie === fnr) {
        return true;
    }
    return false;
}

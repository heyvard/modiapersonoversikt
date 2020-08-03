import * as Cookies from 'js-cookie';
import { Temagruppe } from '../../models/temagrupper';

const temaValgCookieNavn = 'plukk-tema';

export function getTemaFraCookie(): Temagruppe | undefined {
    return Cookies.get()[temaValgCookieNavn] as Temagruppe;
}

export function setTemaCookie(tema: Temagruppe) {
    const omEnTime = new Date(Date.now());
    omEnTime.setHours(omEnTime.getHours() + 1);
    Cookies.set(temaValgCookieNavn, tema, { expires: omEnTime });
}

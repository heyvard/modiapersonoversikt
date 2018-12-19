import { loggEvent } from './frontendLogger';
import * as moment from 'moment';
import { detect } from 'detect-browser';
import * as Cookies from 'js-cookie';
import { roundToNearest20 } from './math';

const cookieNavn = 'logResolution';

export function loggSkjermInfoDaglig() {
    if (checkIfLoggedToday()) {
        return;
    }
    loggInfo();
    setLoggedTodayCookie();
}

function checkIfLoggedToday() {
    const cookie = Cookies.get(cookieNavn);
    if (cookie) {
        return true;
    }
    return false;
}

function setLoggedTodayCookie() {
    const tomorrow = moment().add(1, 'day').hour(10).startOf('hour').toDate();
    Cookies.set(
        cookieNavn,
        'Screen resolution was reported ' + new Date().toDateString(),
        {
            expires: tomorrow
        });
}

function loggInfo() {
    const screen: Screen = window.screen;
    const browser = detect();

    const tags = {
        screen: `${roundToNearest20(screen.width)} x ${roundToNearest20(screen.height)}`,
        window: `${roundToNearest20(window.innerWidth)} x ${roundToNearest20(window.innerHeight)}`,
        erKontaktsenter: erKontaktsenter(),
        browser: browser && browser.name || undefined
    };
    
    const fields = {
        enhet: getSaksbehandlerEnhet(),
        browserVersion: browser && browser.version || undefined,
        os: browser && browser.os || undefined,
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    };

    loggEvent('LoggSkjerminfo', 'Maskinvare', tags, fields);
}

interface Cookie {
    [name: string]: string;
}

function erKontaktsenter(): boolean | undefined {
    const enhet = getSaksbehandlerEnhet();
    if (enhet) {
        if (enhet.slice(0, 2) === '41') {
            return true;
        } else {
            return false;
        }
    }
    return undefined;
}

function getSaksbehandlerEnhet(): string | undefined {
    const allCookies: Cookie = Cookies.get();
    const cookienavn = Object.keys(allCookies).find(key => key.includes('saksbehandlerinnstillinger'));
    if (cookienavn) {
        return allCookies[cookienavn];
    }
    return undefined;
}
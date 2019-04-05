import { createActionsAndReducerDeprecated } from '../deprecatedRestResource';
import { EndreKontonummerRequest } from './endreKontonummerRequest';
import { postEndreKontonummer } from '../../../api/brukerprofil/endreKontonummer-api';

const { reducer, action, tilbakestill, actionNames } = createActionsAndReducerDeprecated('endre-kontonummer');

export function endreKontonummer(fødselsnummer: string, request: EndreKontonummerRequest) {
    return action(() => postEndreKontonummer(fødselsnummer, request));
}

export function reset() {
    return tilbakestill;
}

export { actionNames };
export default reducer;

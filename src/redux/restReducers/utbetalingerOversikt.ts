import { UtbetalingerResponse } from '../../models/utbetalinger';
import { apiBaseUri } from '../../api/config';
import { createRestResourceReducerAndActions } from '../../rest/utils/restResource';
import { AppState } from '../reducers';
import { getUtbetalingerForSiste30DagerDatoer } from '../../app/personside/infotabs/utbetalinger/utils/utbetalinger-utils';
import { backendDatoformat } from '../../utils/date-utils';

function getUtbetalingerFetchUri(state: AppState) {
    const fodselsnummer = state.gjeldendeBruker.fødselsnummer;

    const datoer = getUtbetalingerForSiste30DagerDatoer();
    const fra = backendDatoformat(datoer.fra);
    const til = backendDatoformat(datoer.til);

    return `${apiBaseUri}/utbetaling/${fodselsnummer}?startDato=${fra}&sluttDato=${til}`;
}

export default createRestResourceReducerAndActions<UtbetalingerResponse>(
    'utbetalinger-oversikt',
    getUtbetalingerFetchUri
);

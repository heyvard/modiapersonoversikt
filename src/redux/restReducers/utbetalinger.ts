import { UtbetalingerResponse } from '../../models/utbetalinger';
import { apiBaseUri } from '../../api/config';
import { createRestResourceReducerAndActions } from '../../rest/utils/restResource';
import { AppState } from '../reducers';
import {
    getFraDateFromFilter,
    getTilDateFromFilter
} from '../../app/personside/infotabs/utbetalinger/utils/utbetalinger-utils';
import { backendDatoformat } from '../../utils/date-utils';

export const tidligsteTilgjengeligeDatoUtbetalingerRestkonto = new Date(Date.now());
tidligsteTilgjengeligeDatoUtbetalingerRestkonto.setFullYear(
    tidligsteTilgjengeligeDatoUtbetalingerRestkonto.getFullYear() - 5
);
tidligsteTilgjengeligeDatoUtbetalingerRestkonto.setMonth(0, 1);
tidligsteTilgjengeligeDatoUtbetalingerRestkonto.setHours(0, 0, 0, 0);

function getUtbetalingerFetchUri(state: AppState) {
    const fodselsnummer = state.gjeldendeBruker.fødselsnummer;

    const utbetalingerFilter = state.utbetalinger.filter;
    const startDato = getFraDateFromFilter(utbetalingerFilter);
    const sluttDato = getTilDateFromFilter(utbetalingerFilter);
    const fra = backendDatoformat(startDato);
    const til = backendDatoformat(sluttDato);

    return `${apiBaseUri}/utbetaling/${fodselsnummer}?startDato=${fra}&sluttDato=${til}`;
}

export default createRestResourceReducerAndActions<UtbetalingerResponse>('utbetalinger', getUtbetalingerFetchUri);

import { createActionsAndReducer } from './restReducer';
import { getUtbetalinger } from '../../api/utbetaling-api';

const { reducer, action, reload, tilbakestillReducer } = createActionsAndReducer('utbetalinger');

export function hentUtbetalinger(fødselsnummer: string) {
    return action(() => getUtbetalinger(fødselsnummer));
}

export function reloadUtbetalinger(fødselsnummer: string) {
    return reload(() => getUtbetalinger(fødselsnummer));
}

export function resetUtbetalingerReducer() {
    return tilbakestillReducer;
}

export default reducer;
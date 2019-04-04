import { createActionsAndReducer } from '../../../restResources/generator/restResource';
import { SykepengerResponse } from '../../../models/ytelse/sykepenger';
import { apiBaseUri } from '../../../api/config';
import { AppState } from '../../reducers';

export function getSykepenger(state: AppState) {
    const fnr = state.gjeldendeBruker.fødselsnummer;
    return `${apiBaseUri}/ytelse/sykepenger/${fnr}`;
}

const { reducer } = createActionsAndReducer<SykepengerResponse>('sykepenger', getSykepenger);

export default reducer;

import { configure } from 'enzyme';
import * as EnzymeReactAdapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import 'babel-polyfill';
import { getMockNavKontor } from '../mock/navkontor-mock';
import 'jest-styled-components';

import reducers from '../redux/reducer';
import { applyMiddleware, createStore } from 'redux';
import { actionNames as navKontorActionNames } from '../redux/navkontor';
import { mockVergemal } from '../mock/vergemal-mock';
import { kontaktinformasjonActionNames } from '../redux/kontaktinformasjon';
import { actionNames as egenAnsattActionNames } from '../redux/egenansatt';
import { actionNames as vergeMålActionNames } from '../redux/vergemal';
import { actionNames as baseUrlsActionNames } from '../redux/baseurls';
import { getMockKontaktinformasjon } from '../mock/kontaktinformasjon-mock';
import { personinformasjonActionNames } from '../redux/personinformasjon';
import { getPerson } from '../mock/person/personMock';
import { erEgenAnsatt } from '../mock/egenansatt-mock';
import { mockBaseUrls } from '../mock/baseUrls-mock';
import { veilederRollerReducerActionNames } from '../redux/veilederRoller';
import { getMockVeilederRoller } from '../mock/veilderRoller-mock';
import { tilrettelagtKommunikasjonActionNames } from '../redux/kodeverk/tilrettelagtKommunikasjonReducer';
import { mockTilrettelagtKommunikasjonKodeverk } from '../mock/kodeverk/tilrettelagt-kommunikasjon-kodeverk-mock';
import { retningsnummerKodeverkActionNames } from '../redux/kodeverk/retningsnummereReducer';
import { postnummerActionNames } from '../redux/kodeverk/postnummerReducer';
import { mockRetningsnummereKodeverk } from '../mock/kodeverk/retningsnummer-mock';
import { mockPostnummere } from '../mock/kodeverk/postnummer-kodeverk-mock';
import thunkMiddleware from 'redux-thunk';
import { landActionNames } from '../redux/kodeverk/landKodeverk';
import { mockLandKodeverk } from '../mock/kodeverk/land-kodeverk-mock';
import { mockValutaKodeverk } from '../mock/kodeverk/valuta-kodeverk-mock';
import { valutaerActionNames } from '../redux/kodeverk/valutaKodeverk';

configure({ adapter: new EnzymeReactAdapter() });

// tslint:disable-next-line
const globalAny: any = global;
globalAny._apiBaseUri = '';
globalAny._mockEnabled = 'true';

export const testStore = createStore(reducers, applyMiddleware(thunkMiddleware));
const aremarkFnr = '10108000398';

testStore.dispatch({ type: personinformasjonActionNames.FINISHED, data: getPerson(aremarkFnr)});
testStore.dispatch({
    type: navKontorActionNames.FINISHED,
    data: {navKontor: getMockNavKontor('0118', undefined) }
});
testStore.dispatch({ type: kontaktinformasjonActionNames.FINISHED, data: getMockKontaktinformasjon(aremarkFnr) });
testStore.dispatch({ type: egenAnsattActionNames.FINISHED, data: erEgenAnsatt(aremarkFnr) });
testStore.dispatch({ type: vergeMålActionNames.FINISHED, data: mockVergemal(aremarkFnr) });
testStore.dispatch({ type: baseUrlsActionNames.FINISHED, data: mockBaseUrls() });
testStore.dispatch({ type: veilederRollerReducerActionNames.FINISHED, data: getMockVeilederRoller() });
testStore.dispatch({
    type: tilrettelagtKommunikasjonActionNames.FINISHED, data: mockTilrettelagtKommunikasjonKodeverk()
});
testStore.dispatch({ type: retningsnummerKodeverkActionNames.FINISHED, data: mockRetningsnummereKodeverk() });
testStore.dispatch({ type: postnummerActionNames.FINISHED, data: mockPostnummere() });
testStore.dispatch({ type: landActionNames.FINISHED, data: mockLandKodeverk() });
testStore.dispatch({ type: valutaerActionNames.FINISHED, data: mockValutaKodeverk() });

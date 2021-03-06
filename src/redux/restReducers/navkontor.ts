import { createRestResourceReducerAndActions } from '../../rest/utils/restResource';
import { apiBaseUri } from '../../api/config';
import { AppState } from '../reducers';
import { isLoadedPerson } from './personinformasjon';
import { NavKontorResponse } from '../../models/navkontor';
import { Kodeverk } from '../../models/kodeverk';
import { abortFetch } from '../../rest/utils/utils';
import { loggError } from '../../utils/logger/frontendLogger';

export function getUrl(geografiskTilknytning?: string, diskresjonsKode?: Kodeverk) {
    return `${apiBaseUri}/enheter?gt=${geografiskTilknytning || ''}${
        diskresjonsKode ? '&dkode=' + diskresjonsKode.kodeRef : ''
    }`;
}

function getBrukersNavkontorFetchUri(state: AppState) {
    const personResource = state.restResources.personinformasjon;
    if (!isLoadedPerson(personResource)) {
        loggError(
            Error(
                'Prøvde å fetche navkontor før personinfo var lastet. Uten personinfo har vi ikke geografisk tilknytning som trengs for å fetche navkontor'
            )
        );
        return abortFetch;
    }
    const geografiskTilknytning = personResource.data.geografiskTilknytning;
    const diskresjonsKode = personResource.data.diskresjonskode;
    return getUrl(geografiskTilknytning, diskresjonsKode);
}

export default createRestResourceReducerAndActions<NavKontorResponse>('navkontor', getBrukersNavkontorFetchUri);

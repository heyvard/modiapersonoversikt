import { Traad } from '../../models/meldinger/meldinger';
import { MeldingerActionTypes, SetValgtTraad } from './types';

export function setValgtTraadMeldingspanel(traad: Traad): SetValgtTraad {
    return {
        type: MeldingerActionTypes.SetValgtTraad,
        traad: traad
    };
}

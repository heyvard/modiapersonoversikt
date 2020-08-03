import * as React from 'react';
import { Periode } from '../../models/tid';
import { formaterDato } from '../../utils/date-utils';
import EtikettGrå from '../EtikettGrå';

interface Props {
    periode: Periode;
}

function VisPeriode({ periode }: Props) {
    const fra = formaterDato(periode.fra);
    const til = formaterDato(periode.til);
    return (
        <EtikettGrå>
            Gyldig: {fra} - {til}
        </EtikettGrå>
    );
}

export default VisPeriode;

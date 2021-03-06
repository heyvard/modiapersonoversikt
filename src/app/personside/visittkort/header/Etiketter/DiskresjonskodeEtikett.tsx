import * as React from 'react';
import { Kodeverk } from '../../../../../models/kodeverk';
import EtikettBase from 'nav-frontend-etiketter';
import { Diskresjonskoder } from '../../body/familie/common/Diskresjonskode';

function DiskresjonskodeEtikett(props: { diskresjonskode?: Kodeverk }) {
    if (!props.diskresjonskode) {
        return null;
    }
    switch (props.diskresjonskode.kodeRef) {
        case Diskresjonskoder.STRENGT_FORTROLIG_ADRESSE:
            return <EtikettBase type={'advarsel'}>Kode 6</EtikettBase>;
        case Diskresjonskoder.FORTROLIG_ADRESSE:
            return <EtikettBase type={'advarsel'}>Kode 7</EtikettBase>;
        default:
            return null;
    }
}

export default DiskresjonskodeEtikett;

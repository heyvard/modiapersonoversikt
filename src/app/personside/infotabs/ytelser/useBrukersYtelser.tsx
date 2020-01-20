import { useMemo } from 'react';
import { getPleiepengerIdDato, Pleiepengerettighet } from '../../../../models/ytelse/pleiepenger';
import { getSykepengerIdDato, Sykepenger } from '../../../../models/ytelse/sykepenger';
import { Foreldrepengerettighet, getForeldepengerIdDato } from '../../../../models/ytelse/foreldrepenger';
import { useRestResource } from '../../../../rest/consumer/useRestResource';
import { datoSynkende } from '../../../../utils/dateUtils';
export type Ytelse = Pleiepengerettighet | Foreldrepengerettighet | Sykepenger;

interface YtelseMedDato {
    idDato: string;
    ytelse: Ytelse;
}

interface Returns {
    ytelserSortert: Ytelse[];
    pendingYtelser: boolean;
}

function useBrukersYtelser(): Returns {
    const foreldrepengerResource = useRestResource(resources => resources.foreldrepenger, undefined, true);
    const pleiepengerResource = useRestResource(resources => resources.pleiepenger, undefined, true);
    const sykepengerResource = useRestResource(resources => resources.sykepenger, undefined, true);

    const foreldrepenger: YtelseMedDato[] = useMemo(
        () =>
            foreldrepengerResource.data && foreldrepengerResource.data.foreldrepenger
                ? foreldrepengerResource.data.foreldrepenger.map(foreldrepengerettighet => {
                      const idDato = getForeldepengerIdDato(foreldrepengerettighet);
                      return {
                          idDato: idDato,
                          ytelse: foreldrepengerettighet
                      };
                  })
                : [],
        [foreldrepengerResource]
    );

    const pleiepenger: YtelseMedDato[] = useMemo(
        () =>
            pleiepengerResource.data && pleiepengerResource.data.pleiepenger
                ? pleiepengerResource.data.pleiepenger.map(pleiepengerettighet => {
                      const idDato = getPleiepengerIdDato(pleiepengerettighet);
                      return {
                          idDato: idDato,
                          ytelse: pleiepengerettighet
                      };
                  })
                : [],
        [pleiepengerResource]
    );

    const sykepenger: YtelseMedDato[] = useMemo(
        () =>
            sykepengerResource.data && sykepengerResource.data.sykepenger
                ? sykepengerResource.data.sykepenger.map(sykepengerettighet => {
                      const idDato = getSykepengerIdDato(sykepengerettighet);
                      return {
                          idDato: idDato,
                          ytelse: sykepengerettighet
                      };
                  })
                : [],
        [sykepengerResource]
    );

    const pendingResourcer =
        pleiepengerResource.isLoading || foreldrepengerResource.isLoading || sykepengerResource.isLoading;
    const ytelserSortert = useMemo(
        () =>
            [...foreldrepenger, ...pleiepenger, ...sykepenger]
                .sort(datoSynkende(rettighet => rettighet.idDato))
                .map(rettighet => rettighet.ytelse),
        [foreldrepenger, pleiepenger, sykepenger]
    );

    return { ytelserSortert, pendingYtelser: pendingResourcer };
}

export default useBrukersYtelser;

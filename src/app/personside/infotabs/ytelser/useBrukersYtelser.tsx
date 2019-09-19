import { useOnMount, useRestResource } from '../../../../utils/customHooks';
import { useDispatch } from 'react-redux';
import { hasData, isLoading, isNotStarted } from '../../../../rest/utils/restResource';
import { ReactNode, useMemo } from 'react';
import { datoSynkende } from '../../../../utils/dateUtils';
import { getPleiepengerIdDato, Pleiepengerettighet } from '../../../../models/ytelse/pleiepenger';
import { getSykepengerIdDato, Sykepenger } from '../../../../models/ytelse/sykepenger';
import { Foreldrepengerettighet, getForeldepengerIdDato } from '../../../../models/ytelse/foreldrepenger';

interface YtelseMedDato {
    idDato: string;
    markup: ReactNode;
}

interface Props {
    renderPleiepenger: (pleiepenger: Pleiepengerettighet) => ReactNode;
    renderSykepenger: (sykepenger: Sykepenger) => ReactNode;
    renderForeldrepenger: (foreldrepenger: Foreldrepengerettighet) => ReactNode;
}

function useBrukersYtelser(props: Props) {
    const foreldrepengerResource = useRestResource(resources => resources.foreldrepenger);
    const pleiepengerResource = useRestResource(resources => resources.pleiepenger);
    const sykepengerResource = useRestResource(resources => resources.sykepenger);
    const dispatch = useDispatch();

    useOnMount(() => {
        if (isNotStarted(foreldrepengerResource)) {
            dispatch(foreldrepengerResource.actions.fetch);
        }
        if (isNotStarted(pleiepengerResource)) {
            dispatch(pleiepengerResource.actions.fetch);
        }
        if (isNotStarted(sykepengerResource)) {
            dispatch(sykepengerResource.actions.fetch);
        }
    });

    const foreldrepenger: YtelseMedDato[] = useMemo(
        () =>
            hasData(foreldrepengerResource) && foreldrepengerResource.data.foreldrepenger
                ? foreldrepengerResource.data.foreldrepenger.map(foreldrepengerettighet => {
                      const idDato = getForeldepengerIdDato(foreldrepengerettighet);
                      return {
                          idDato: idDato,
                          markup: props.renderForeldrepenger(foreldrepengerettighet)
                      };
                  })
                : [],
        [foreldrepengerResource, props]
    );

    const pleiepenger: YtelseMedDato[] = useMemo(
        () =>
            hasData(pleiepengerResource) && pleiepengerResource.data.pleiepenger
                ? pleiepengerResource.data.pleiepenger.map(pleiepengerettighet => {
                      const idDato = getPleiepengerIdDato(pleiepengerettighet);
                      return {
                          idDato: idDato,
                          markup: props.renderPleiepenger(pleiepengerettighet)
                      };
                  })
                : [],
        [pleiepengerResource, props]
    );

    const sykepenger: YtelseMedDato[] = useMemo(
        () =>
            hasData(sykepengerResource) && sykepengerResource.data.sykepenger
                ? sykepengerResource.data.sykepenger.map(sykepengerettighet => {
                      const idDato = getSykepengerIdDato(sykepengerettighet);
                      return {
                          idDato: idDato,
                          markup: props.renderSykepenger(sykepengerettighet)
                      };
                  })
                : [],
        [sykepengerResource, props]
    );

    const ytelser = useMemo(
        () =>
            [...foreldrepenger, ...pleiepenger, ...sykepenger]
                .sort(datoSynkende(rettighet => rettighet.idDato))
                .map(rettighet => rettighet.markup),
        [foreldrepenger, pleiepenger, sykepenger]
    );

    const pending =
        isLoading(pleiepengerResource) || isLoading(foreldrepengerResource) || isLoading(sykepengerResource);

    return { ytelser, pending };
}

export default useBrukersYtelser;
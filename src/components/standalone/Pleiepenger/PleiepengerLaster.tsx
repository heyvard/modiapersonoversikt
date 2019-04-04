import * as React from 'react';
import styled from 'styled-components';

import NavFrontendSpinner from 'nav-frontend-spinner';
import AlertStripe, { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Pleiepengerettighet, PleiepengerResponse } from '../../../models/ytelse/pleiepenger';
import FillCenterAndFadeIn from '../../FillCenterAndFadeIn';
import Pleiepenger from '../../../app/personside/infotabs/ytelser/pleiepenger/Pleiepenger';
import { FlexCenter } from '../../common-styled-components';
import theme from '../../../styles/personOversiktTheme';
import RestResourceConsumerTyped from '../../../restResources/consumer/RestResourceConsumerTyped';

interface Props {
    fødselsnummer: string;
    barnetsFødselsnummer: string;
}

const Margin = styled.div`
    margin: 0.5em;
`;

const Style = styled.div`
    ${theme.hvittPanel};
    max-width: ${theme.width.ytelser};
`;

const onPending = (
    <FillCenterAndFadeIn>
        <Margin>
            <NavFrontendSpinner type={'XL'} />
        </Margin>
    </FillCenterAndFadeIn>
);

const onError = (
    <FillCenterAndFadeIn>
        <AlertStripe type="advarsel">Beklager. Det skjedde en feil ved lasting av pleiepenger.</AlertStripe>
    </FillCenterAndFadeIn>
);

class PleiepengerLaster extends React.PureComponent<Props> {
    getAktuellPleiepengeRettighet(pleiepengeRettighet: Pleiepengerettighet[] | null) {
        if (!pleiepengeRettighet) {
            return <AlertStripeInfo>Kunne ikke finne noen pleiepengerettigheter for bruker</AlertStripeInfo>;
        }

        const aktuellRettighet = pleiepengeRettighet.find(
            rettighet => rettighet.barnet === this.props.barnetsFødselsnummer
        );

        if (!aktuellRettighet) {
            return <AlertStripeInfo>Kunne ikke finne pleiepengerettighet for barnet</AlertStripeInfo>;
        }

        return (
            <FlexCenter>
                <Style>
                    <Pleiepenger pleiepenger={aktuellRettighet} />
                </Style>
            </FlexCenter>
        );
    }

    render() {
        return (
            <RestResourceConsumerTyped<PleiepengerResponse>
                getRestResource={restResources => restResources.pleiepenger}
                returnOnPending={onPending}
                returnOnError={onError}
            >
                {data => this.getAktuellPleiepengeRettighet(data.pleiepenger)}
            </RestResourceConsumerTyped>
        );
    }
}

export default PleiepengerLaster;

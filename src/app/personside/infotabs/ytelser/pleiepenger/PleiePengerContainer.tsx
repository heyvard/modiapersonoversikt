import * as React from 'react';
import { PleiepengerResponse } from '../../../../../models/ytelse/pleiepenger';
import { loggEvent } from '../../../../../utils/frontendLogger';
import PleiepengerEkspanderbartpanel from './PleiepengerEkspanderbartPanel';
import RestResourceConsumer from '../../../../../rest/consumer/RestResourceConsumer';
import { useEffect } from 'react';

function PleiePengerContainer() {
    useEffect(() => {
        loggEvent('Sidevisning', 'Pleiepenger');
    }, []);

    return (
        <RestResourceConsumer<PleiepengerResponse>
            spinnerSize="M"
            getResource={restResources => restResources.pleiepenger}
        >
            {data => {
                if (!data.pleiepenger || !data.pleiepenger[0]) {
                    return null;
                }
                return data.pleiepenger.map((pleiepengeRettighet, index) => (
                    <PleiepengerEkspanderbartpanel key={index} pleiepenger={pleiepengeRettighet} />
                ));
            }}
        </RestResourceConsumer>
    );
}

export default PleiePengerContainer;

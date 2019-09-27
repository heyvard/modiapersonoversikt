import * as React from 'react';
import { Traad } from '../../../../../models/meldinger/meldinger';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import styled from 'styled-components';
import theme from '../../../../../styles/personOversiktTheme';
import { useSokEtterMeldinger } from '../utils/meldingerUtils';
import { Input } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import TraadListeElement from './TraadListeElement';
import { LenkeKnapp } from '../../../../../components/common-styled-components';

interface Props {
    traader: Traad[];
    valgtTraad?: Traad;
    sokeord: string;
    setSokeord: (newSokeord: string) => void;
}

const PanelStyle = styled.nav`
    ${theme.hvittPanel};
    ol {
        list-style: none;
    }
`;

const SokVerktøyStyle = styled.div`
    padding: 0 ${theme.margin.layout} ${theme.margin.layout};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const TraadListeStyle = styled.ol`
    > *:not(:first-child) {
        border-top: ${theme.border.skille};
    }
`;
const InputStyle = styled.div`
    padding: ${theme.margin.layout} ${theme.margin.layout} 0;
`;

function TraadListe(props: Props) {
    const traaderEtterSok = useSokEtterMeldinger(props.traader, props.sokeord);

    if (props.traader.length === 0) {
        return <AlertStripeInfo>Det finnes ingen meldinger for bruker.</AlertStripeInfo>;
    }

    const soketreffTekst =
        props.sokeord.length > 0
            ? `Søket traff ${traaderEtterSok.length} av ${props.traader.length} ${
                  props.traader.length === 1 ? 'melding' : 'meldinger'
              }`
            : `Totalt ${props.traader.length} ${props.traader.length === 1 ? 'melding' : 'meldinger'}`;

    return (
        <PanelStyle>
            <InputStyle>
                <Input
                    value={props.sokeord}
                    onChange={event => props.setSokeord(event.target.value)}
                    label={'Søk etter melding'}
                    className={'move-input-label'}
                />
            </InputStyle>
            <SokVerktøyStyle>
                <Normaltekst>{soketreffTekst}</Normaltekst>
                {props.sokeord !== '' && <LenkeKnapp onClick={() => props.setSokeord('')}>Alle meldinger</LenkeKnapp>}
            </SokVerktøyStyle>
            <TraadListeStyle>
                {traaderEtterSok.map(traad => (
                    <TraadListeElement
                        sokeord={props.sokeord}
                        traad={traad}
                        key={traad.traadId}
                        erValgt={traad === props.valgtTraad}
                    />
                ))}
            </TraadListeStyle>
        </PanelStyle>
    );
}

export default TraadListe;

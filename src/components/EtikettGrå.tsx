import * as React from 'react';
import EtikettLiten from 'nav-frontend-typografi/lib/etikett-liten';
import styled from 'styled-components';
import { ReactNode } from 'react';
import { TypografiProps } from 'nav-frontend-typografi';

interface Props extends TypografiProps {
    children: ReactNode;
}

const Wrapper = styled.div`
    color: #78706a;
    margin-top: 3px;
    .typo-etikett-liten {
      line-height: 1rem;
    }
`;

function EtikettGrå(props: Props) {
    const { children, ...resten } = props;
    return (
        <Wrapper>
            <EtikettLiten {...resten}>
                    {children}
            </EtikettLiten>
        </Wrapper>
    );
}

export default EtikettGrå;

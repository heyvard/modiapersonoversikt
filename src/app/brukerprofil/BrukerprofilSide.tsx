import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { paths } from '../routes/routing';
import { erDød, Person, PersonRespons } from '../../models/person/person';
import { VeilederRoller } from '../../models/veilederRoller';
import { isNotStarted, Loaded, DeprecatedRestResource } from '../../redux/restReducers/deprecatedRestResource';
import { theme } from '../../styles/personOversiktTheme';
import Innholdslaster from '../../components/Innholdslaster';
import BrukerprofilForm from './BrukerprofilForm';
import { AppState } from '../../redux/reducers';
import { getVeilederRoller } from '../../redux/restReducers/veilederRoller';
import { connect } from 'react-redux';
import { FormatertKontonummer } from '../../utils/FormatertKontonummer';
import { Normaltekst, Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { loggEvent } from '../../utils/frontendLogger';
import HandleBrukerprofilHotkeys from './HandleBrukerprofilHotkeys';
import { erNyePersonoversikten } from '../../utils/erNyPersonoversikt';
import { AsyncDispatch } from '../../redux/ThunkTypes';
import { TilbakePil } from '../../components/common-styled-components';
import { BigCenteredLazySpinner } from '../../components/BigCenteredLazySpinner';

const BrukerprofilWrapper = styled.article`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    ${theme.animation.fadeIn};
`;

const HeaderStyle = styled.section`
    display: flex;
    flex-shrink: 0;
    padding: ${theme.margin.px20};
    background-color: white;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.1);
    z-index: 100;
`;

const HeaderContent = styled.section`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ContentWrapper = styled.section`
    overflow-y: auto;
    flex-grow: 1;
    padding: 3rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    > * {
        max-width: 720px;
        width: 90%;
        ${theme.hvittPanel};
        margin: 1em 0;
        padding: 2em;
    }
`;

const LinkWrapper = styled.div`
    margin-bottom: 1em;
`;

const Fokus = styled.div`
    &:focus {
        ${theme.focus}
    }
`;

interface DispatchProps {
    hentVeilederRoller: () => void;
}

interface StateProps {
    personResource: DeprecatedRestResource<PersonRespons>;
    veilederRollerResource: DeprecatedRestResource<VeilederRoller>;
}

type Props = StateProps & DispatchProps;

function hentNavn({ navn }: Person) {
    return navn.fornavn + (navn.mellomnavn ? ' ' + navn.mellomnavn + ' ' : ' ') + navn.etternavn;
}

function getAlder(person: Person) {
    return erDød(person.personstatus) ? 'Død' : person.alder;
}

function Navn({ person }: { person: Person }) {
    return (
        <Normaltekst>
            {hentNavn(person)} ({getAlder(person)})
        </Normaltekst>
    );
}

function Konto({ person }: { person: Person }) {
    return (
        <Undertekst>
            Kontonummer: <FormatertKontonummer kontonummer={(person.bankkonto && person.bankkonto.kontonummer) || ''} />
        </Undertekst>
    );
}

function TilbakeLenke({ fnr }: { fnr: string }) {
    return (
        <LinkWrapper>
            <Link className={'lenke'} to={`${paths.personUri}/${fnr}`}>
                <TilbakePil>Tilbake</TilbakePil>
            </Link>
        </LinkWrapper>
    );
}

class Header extends React.PureComponent<{ person: Person }> {
    private ref = React.createRef<HTMLDivElement>();

    componentDidMount() {
        if (this.ref.current) {
            this.ref.current.focus();
        }
    }

    render() {
        const person = this.props.person;
        return (
            <HeaderStyle>
                <TilbakeLenke fnr={person.fødselsnummer} />
                <HeaderContent>
                    <Fokus ref={this.ref} tabIndex={-1}>
                        <Systemtittel tag="h1">Administrer brukerprofil</Systemtittel>
                    </Fokus>
                    <div>
                        <Navn person={person} />
                        <Konto person={person} />
                    </div>
                </HeaderContent>
            </HeaderStyle>
        );
    }
}

class BrukerprofilSide extends React.PureComponent<Props> {
    componentDidMount() {
        if (isNotStarted(this.props.veilederRollerResource)) {
            this.props.hentVeilederRoller();
        }
        loggEvent('Sidevisning', 'Brukerprofil');
    }

    render() {
        return (
            <BrukerprofilWrapper>
                {erNyePersonoversikten() && <HandleBrukerprofilHotkeys />}
                <Innholdslaster
                    avhengigheter={[this.props.personResource, this.props.veilederRollerResource]}
                    returnOnPending={BigCenteredLazySpinner}
                >
                    {erNyePersonoversikten() && (
                        <Header person={(this.props.personResource as Loaded<PersonRespons>).data as Person} />
                    )}
                    <ContentWrapper>
                        <BrukerprofilForm
                            person={(this.props.personResource as Loaded<PersonRespons>).data as Person}
                            veilderRoller={(this.props.veilederRollerResource as Loaded<VeilederRoller>).data}
                        />
                    </ContentWrapper>
                </Innholdslaster>
            </BrukerprofilWrapper>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        personResource: state.restResources.personinformasjon,
        veilederRollerResource: state.restResources.veilederRoller
    };
};

function mapDispatchToProps(dispatch: AsyncDispatch): DispatchProps {
    return {
        hentVeilederRoller: () => dispatch(getVeilederRoller())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BrukerprofilSide);

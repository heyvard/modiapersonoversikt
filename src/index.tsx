import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import renderDecoratorHead from './decorator';
import { parseUrlForPersonIKontekst } from './utils/urlUtils';
import App from './app/App';

ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement
);

const fodselsnummer = parseUrlForPersonIKontekst(window.location);
renderDecoratorHead(fodselsnummer);

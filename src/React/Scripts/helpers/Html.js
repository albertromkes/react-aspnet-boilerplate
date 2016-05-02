import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

export default class Html extends Component {
  static propTypes = {
    component: PropTypes.node,
    store: PropTypes.object
  };
  renderJsInclude() {
    let src = '/pack/client.generated.js';
    if (__ISDEVELOPMENT__) {
      const devServer = require('../webpack/devServer');
      src = 'http://' + devServer.host + ':' + devServer.port + '/client.generated.js';
    }

    return <script src={src} charSet="UTF-8" />;
  }

  render() {
    const { component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang="en-us">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="/pack/styles.css"
            media="screen, projection"
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
          />
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
          <script
            dangerouslySetInnerHTML =
            {
              { __html: `window.__data=${serialize(store.getState())};` }
            }
            charSet="UTF-8"
          />
          {this.renderJsInclude()}
        </body>
      </html>
    );
  }
}

'use strict';

/**
 * Tool for resolving ids.
 *
 * Listens for:
 *   - configure
 *   - init
 * Emits:
 *   - has-ids
 *   - has-item
 */

var chan, options, spinner, spinnerEl, ListWidgets;

ListWidgets = window['list-widgets'];

options = {};

spinner = new Spinner({
  color: '#000',
  top: '250px',
  radius: 100,
  length: 100,
  width: 50,
  lines: 12
});

spinnerEl = document.getElementById('spinner');
spinner.spin();
spinnerEl.appendChild(spinner.el);

setInterval(modifyStyle, 100);

chan = Channel.build({
  window: window.parent,
  origin: "*",
  scope: "CurrentStep"
});

chan.bind('configure', function (trans, params) {
  var key; // Copy over configuration.
  if (params) {
    for (key in params) {
      options[key] = params[key];
    }
  }
  return 'ok';
});
chan.bind('style', function (trans, params) {

  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement('link');

  link.rel = "stylesheet";
  link.href = params.stylesheet;

  head.appendChild(link);

});

chan.bind('init', function (trans, params) {
  var widgets
    , request = params.request
    , service = params.service
    , element = document.getElementById('main')
    , config = {};

  try {
    config.matchCb = hasItem;
    config.resultsCb = wantsTable;
    config.listCb = wantsList;

    config.errorCorrection = request.correction;
    config.pValue = request.maxp;
    config.current_population = request.background;

    if (service.root.charAt(service.root.length - 1) !== '/') {
      service.root += '/';
    }

    widgets = new ListWidgets(service);
    widgets.enrichment(request.enrichment, request.list, element, config);
  } catch (e) {
    trans.error('InitialisationError', String(e));
  }


  function hasItem (id, type) {
    // Notify as generic and specific item.
    chan.notify({
      method: 'has',
      params: {
        what: 'item',
        data: {
          id: id,
          type: type,
          service: {
            root: service.root
          }
        }
      }
    });
    chan.notify({
      method: 'has',
      params: {
        what: type,
        data: {
          id: id,
          service: {
            root: service.root
          }
        }
      }
    });
  }

  function wantsTable (query) {
    chan.notify({
      method: 'wants',
      params: {
        what: 'table',
        data: {
          query: query,
          service: { root: service.root }
        }
      }
    });
  }

  function wantsList (query) {
    chan.notify({
      method: 'wants',
      params: {
        what: 'list',
        data: {
          query: query,
          service: { root: service.root }
        }
      }
    });
  }

});

function modifyStyle () {
  ensureHasClass('.group', 'form-group');
  ensureHasClass('.btn', 'btn-default');
  ensureHasClass('.group select', 'form-control');

  function ensureHasClass(selector, className) {
    var i, l, elems, e, classes;
    
    elems = document.querySelectorAll(selector);

    for (i = 0, l = elems.length; i < l; i++) {
      e = elems[i];
      classes = (e.className || '');
      if (classes.indexOf(className) === -1) {
        e.className = e.className + ' ' + className;
      }
    }
  }
}


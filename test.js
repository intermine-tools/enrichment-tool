var chan = Channel.build({
  window: document.getElementById("child").contentWindow,
  origin: "*",
  scope: "CurrentStep"
});

chan.bind('has', function (trans, payload) {
  console.log('has', payload.what, payload.data);
});
chan.bind('wants', function (trans, payload) {
  console.log('wants', payload.what, payload.data);
});

var sessionRequest = new XMLHttpRequest();
sessionRequest.onload = withSession.bind(null, sessionRequest);
sessionRequest.open('GET', "http://www.flymine.org/query/service/session", true);
sessionRequest.responseType = 'json';
sessionRequest.send();

function withSession (req, e) {
  console.log(req.response);

  chan.call({
    method: "init",
    params: {
      service: {
        root: "http://www.flymine.org/query/service",
        token: req.response.token,
      },
      request: {
        enrichment: 'pathway_enrichment',
        list: 'PL FlyAtlas_brain_top',
        correction: 'Benjamini-Hochberg',
        maxp: 0.05
      }
    },
    success: function() {
      console.log("Table initialised");
    },
    error: console.error.bind(console, '[ERR]')
  });
}

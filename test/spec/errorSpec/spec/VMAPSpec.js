'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/vmap.xml';

describe("Test for VMAPSpec", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();
  var env = rmpVast.getEnv();
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
    video.setAttribute('muted', 'muted');
  } else if (env.isMacOSX && env.isSafari[0]) {
    video.muted = true;
  }
  var title = document.getElementsByTagName('title')[0];

  it("should load adTag and trigger an error", function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log('RMP-VAST-TEST: ' + event.type);
      }
    };

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('aderror', function (e) {
      _incrementAndLog(e);
      expect(rmpVast.getAdVastErrorCode()).toBe(200);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(3);
      if (validSteps === 3) {
        title.textContent = 'Test completed';
      }
      setTimeout(function () {
        done();
      }, 500);
    });

    rmpVast.loadAds(ADTAG);

  });


});

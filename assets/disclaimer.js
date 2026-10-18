/*
 * Access To — one-time disclaimer acknowledgment.
 *
 * Load on interactive pages only:
 *   <script src="…/assets/disclaimer.js" data-acknowledge defer></script>
 *
 * Shows the full disclaimer in a modal dialog before first use and remembers
 * the answer per browser under a versioned localStorage key. If storage is
 * unavailable (private mode, blocked site data), the dialog simply shows
 * again next time. 911 and 988 stay reachable: the persistent notice is plain
 * markup in every page, and the dialog itself carries tel: links.
 *
 * Bump ACK_KEY (…-v2) when the wording changes materially, so everyone sees
 * the new text once.
 */
(function (root) {
  'use strict';

  var ACK_KEY = 'disclaimer-ack-v1';
  var TITLE = 'Access to Justice';
  var FULL_URL = 'https://github.com/dougdevitre/access-to-justice/blob/main/DISCLAIMER.md';

  function hasAck(storage) {
    try {
      return !!storage && storage.getItem(ACK_KEY) === 'yes';
    } catch (e) {
      return false;
    }
  }

  function recordAck(storage) {
    try {
      if (!storage) return false;
      storage.setItem(ACK_KEY, 'yes');
      return true;
    } catch (e) {
      return false;
    }
  }

  function getStorage() {
    try {
      return root.localStorage;
    } catch (e) {
      return null;
    }
  }

  var BODY_HTML =
    '<p>' + TITLE + ' provides general educational information only. It is not legal, medical, mental health, financial or safety advice. Using it does not create an attorney-client, clinician-patient or any other professional relationship with Doug Devitre, CoTrackPro or any contributor.</p>' +
    '<ul>' +
    '<li><strong>Not for emergencies.</strong> If anyone is in danger, call <a href="tel:911">911</a>. For crisis support, call or text <a href="tel:988">988</a>.</li>' +
    '<li><strong>Not a substitute for a professional.</strong> Talk with a licensed attorney, clinician or trained advocate about your situation.</li>' +
    '<li><strong>Information can be wrong or out of date.</strong> Laws, programs, phone numbers, eligibility rules and deadlines change. Confirm everything with the official source before you rely on it.</li>' +
    '<li><strong>AI output can be incorrect.</strong> Review everything it produces. You are responsible for the decisions you make and anything you file or send.</li>' +
    '<li><strong>Protect privacy.</strong> Do not enter names, case numbers, addresses or other details that identify a person.</li>' +
    '<li><strong>No endorsement.</strong> Not affiliated with or endorsed by any court, agency or organization it mentions.</li>' +
    '<li><strong>No warranty.</strong> Provided "as is," without warranties of any kind. To the fullest extent the law allows, the maintainers and contributors are not liable for damages arising from its use.</li>' +
    '</ul>' +
    '<p class="a2-ack-more"><a href="' + FULL_URL + '" target="_blank" rel="noopener">Read the full disclaimer</a> (opens in a new tab)</p>';

  function showAcknowledgment(doc, storage) {
    if (hasAck(storage)) return null;
    if (typeof doc.createElement('dialog').showModal !== 'function') return null;

    var dialog = doc.createElement('dialog');
    dialog.className = 'a2-ack';
    dialog.id = 'a2-ack';
    dialog.setAttribute('aria-labelledby', 'a2-ack-title');
    dialog.setAttribute('aria-describedby', 'a2-ack-desc');
    dialog.innerHTML =
      '<div class="a2-ack-inner">' +
        '<div class="a2-ack-body">' +
          '<h2 id="a2-ack-title" tabindex="-1">Before you use ' + TITLE + '</h2>' +
          '<div id="a2-ack-desc">' + BODY_HTML + '</div>' +
        '</div>' +
        '<div class="a2-ack-actions">' +
          '<button type="button" id="a2-ack-ok">I understand</button>' +
        '</div>' +
      '</div>';
    doc.body.appendChild(dialog);

    var acknowledged = false;
    var button = dialog.querySelector('#a2-ack-ok');

    button.addEventListener('click', function () {
      acknowledged = true;
      recordAck(storage);
      dialog.close();
    });

    // Esc must not dismiss without acknowledging.
    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
    });
    // Some browsers close anyway on a repeated Esc; reopen until acknowledged.
    dialog.addEventListener('close', function () {
      if (!acknowledged) {
        dialog.showModal();
        focusTitle();
        return;
      }
      dialog.parentNode && dialog.parentNode.removeChild(dialog);
    });

    // Keep Tab / Shift+Tab inside the dialog (native modal already makes the
    // page inert; this also stops focus escaping to the browser chrome).
    dialog.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      var focusables = dialog.querySelectorAll('a[href], button, [tabindex="-1"]');
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    function focusTitle() {
      var title = dialog.querySelector('#a2-ack-title');
      if (title) title.focus();
    }

    dialog.showModal();
    focusTitle();
    return dialog;
  }

  var api = {
    ACK_KEY: ACK_KEY,
    hasAck: hasAck,
    recordAck: recordAck,
    showAcknowledgment: showAcknowledgment
  };
  root.AccessToDisclaimer = api;

  if (typeof document === 'undefined') return;
  var script = document.currentScript;
  if (!script || !script.hasAttribute('data-acknowledge')) return;

  function start() {
    try {
      showAcknowledgment(document, getStorage());
    } catch (e) {
      // Never break the page over the dialog; the persistent notice remains.
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(typeof window !== 'undefined' ? window : globalThis);

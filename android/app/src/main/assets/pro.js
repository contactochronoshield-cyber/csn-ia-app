(function () {
'use strict';

var PAYPAL_EMAIL = 'pampihola5@gmail.com';
var CONTACT_EMAIL = 'contactochronoshield@gmail.com';
var PAYPAL_SEND_URL = 'https://www.paypal.com/send';

var style = document.createElement('style');
style.textContent = `
#t-pro .csn-plans {display:grid;grid-template-columns:1fr;gap:13px;margin-top:16px}
#t-pro .csn-plan {background:#101d32;border:1px solid #263d5d;border-radius:16px;padding:17px;color:#eef5ff}
#t-pro .csn-plan.featured {border:1px solid #168ee8;box-shadow:0 0 18px rgba(22,142,232,.13)}
#t-pro .csn-plan h2 {font-size:19px;margin:5px 0 8px;color:#fff}
#t-pro .csn-plan p {line-height:1.5}
#t-pro .csn-plan ul {padding-left:19px;line-height:1.8}
#t-pro .csn-tag {display:inline-block;border-radius:30px;padding:5px 10px;background:#173b61;color:#8ed4ff;font-size:12px;font-weight:700}
#t-pro .csn-plan .btn {width:100%;margin-top:10px}
#t-pro .csn-paybox {background:#0b1728;border:1px solid #24517c;border-radius:14px;padding:15px;margin-top:15px}
#t-pro .csn-payemail {display:block;width:100%;box-sizing:border-box;padding:12px;border-radius:9px;border:1px solid #426080;background:#08111e;color:#fff;font-size:15px;margin:10px 0}
#t-pro .csn-payactions {display:flex;gap:9px;flex-wrap:wrap}
#t-pro .csn-payactions button {flex:1;min-width:130px}
#t-pro .csn-small {font-size:12px;color:#aebdd0;line-height:1.5}
#t-pro .csn-plan li {margin:3px 0}
`;

document.head.appendChild(style);

var tab = document.createElement('div');
tab.className = 'tab';
tab.id = 't-pro';

tab.innerHTML = `
<div class="pad">
  <span class="bd">CHRONO SHIELD NETWORKS</span>
  <h1>Planes CSN IA</h1>
  <p class="s">Elige el nivel de herramientas y servicios que necesitas. Puedes comenzar gratis y solicitar una ampliación cuando quieras.</p>

  <div class="csn-plans">

    <section class="csn-plan">
      <span class="csn-tag">GRATUITO</span>
      <h2>CSN IA Free</h2>
      <p>Para usuarios que quieren aprender, consultar y comenzar a proteger sus dispositivos.</p>
      <ul>
        <li>Asistente CSN IA.</li>
        <li>Biblioteca de ciberseguridad y tecnología.</li>
        <li>Funciones disponibles de diagnóstico básico.</li>
        <li>Guía y herramientas de orientación disponibles.</li>
      </ul>
      <button class="btn" onclick="tab('chat')">Usar CSN IA</button>
    </section>

    <section class="csn-plan featured">
      <span class="csn-tag">PLAN AVANZADO</span>
      <h2>CSN IA Pro</h2>
      <p>Para usuarios técnicos, profesionales y pequeñas organizaciones que necesitan herramientas avanzadas.</p>
      <ul>
        <li>Funciones del plan gratuito.</li>
        <li>Asistencia técnica avanzada.</li>
        <li>Diagnósticos ampliados de redes y conectividad.</li>
        <li>Orientación en DNS, VPN, Wi-Fi y seguridad.</li>
        <li>Historial y seguimiento cuando estén habilitados.</li>
        <li>Herramientas Pro sujetas a licencia.</li>
      </ul>
      <button class="btn" onclick="csnPayPlan('Pro')">Solicitar CSN IA Pro</button>
    </section>

    <section class="csn-plan">
      <span class="csn-tag">SOLUCIONES EMPRESARIALES</span>
      <h2>CSN IA Enterprise</h2>
      <p>Para empresas, equipos técnicos, infraestructura privada y centros de datos.</p>
      <ul>
        <li>Evaluación de infraestructura y necesidades.</li>
        <li>Gestión de organizaciones y usuarios según licencia.</li>
        <li>Integración con redes privadas y nodos.</li>
        <li>Opciones Cloud, Sovereign e Hybrid.</li>
        <li>Licencias empresariales verificables.</li>
        <li>Configuración y soporte según contrato.</li>
      </ul>
      <button class="btn" onclick="csnPayPlan('Enterprise')">Solicitar Enterprise</button>
    </section>

  </div>

  <div class="csn-paybox" id="csn-paybox">
    <span class="csn-tag">PAGOS PAYPAL</span>
    <h2>Realiza tu pago</h2>
    <p class="s" id="csn-pay-description">Selecciona Pro o Enterprise para preparar tu solicitud.</p>

    <b>Correo de recepción PayPal</b>
    <input class="csn-payemail" id="csn-pay-email"
      type="text" readonly value="pampihola5@gmail.com">

    <div class="csn-payactions">
      <button class="btn" onclick="csnCopyPayPal()">Copiar correo</button>
      <button class="btn" onclick="csnOpenPayPal()">Abrir PayPal</button>
    </div>

    <p class="csn-small">
      En PayPal, utiliza el correo mostrado como destinatario e indica el concepto y el importe acordado.
      El pago debe verificarse antes de activar una licencia.
    </p>
    <p class="csn-small">
      Para enviar el comprobante o solicitar activación:
      <b>contactochronoshield@gmail.com</b>
    </p>
    <p class="csn-small" id="csn-pay-status" aria-live="polite"></p>
  </div>

  <div class="note" style="margin-top:15px">
    <b>Seguridad de licencias</b><br>
    El pago no activa automáticamente funciones ni concede permisos empresariales.
    La activación se realiza después de verificar el pago y emitir la licencia correspondiente.
  </div>

  <p class="s" style="margin-top:16px">
    Chrono Shield Networks · Una compañía Chrono Shield Systems
  </p>
</div>
`;

var webTab = document.getElementById('t-web');
if (webTab && !document.getElementById('t-pro')) {
    document.body.insertBefore(tab, webTab);
} else if (webTab) {
    webTab.parentNode.insertBefore(tab, webTab);
} else {
    document.body.appendChild(tab);
}

window.csnPayPlan = function (plan) {
    var description = document.getElementById('csn-pay-description');
    var status = document.getElementById('csn-pay-status');

    if (description) {
        description.textContent =
            'Solicitud de CSN IA ' + plan +
            '. Destinatario PayPal: ' + PAYPAL_EMAIL;
    }

    if (status) {
        status.textContent =
            'Correo preparado. Cópialo y úsalo como destinatario en PayPal.';
    }

    var box = document.getElementById('csn-paybox');
    if (box) {
        box.scrollIntoView({behavior:'smooth', block:'start'});
    }
};

window.csnCopyPayPal = function () {
    var input = document.getElementById('csn-pay-email');
    var status = document.getElementById('csn-pay-status');

    if (!input) return;

    input.focus();
    input.select();
    input.setSelectionRange(0, input.value.length);

    var copied = false;
    try {
        copied = document.execCommand('copy');
    } catch (e) {}

    if (status) {
        status.textContent = copied
            ? 'Correo copiado: ' + PAYPAL_EMAIL
            : 'Selecciona y copia este correo: ' + PAYPAL_EMAIL;
    }
};

window.csnOpenPayPal = function () {
    var status = document.getElementById('csn-pay-status');

    if (status) {
        status.textContent =
            'Abriendo PayPal. Utiliza como destinatario: ' + PAYPAL_EMAIL;
    }

    window.open(PAYPAL_SEND_URL, '_blank');
};

if (typeof K === 'function') {
    K(
      'enterprise|plan enterprise|administrar mi red|administrar mi data center|data center en casa|plan pro|csn ia pro',
      'CSN IA ofrece tres niveles: Gratuito, Pro y Enterprise. Pro incorpora asistencia técnica y herramientas avanzadas sujetas a licencia. Enterprise está orientado a organizaciones, redes privadas e infraestructura empresarial. Consulta la pestaña Pro para solicitar un plan.'
    );

    K(
      'paypal|como pago|pagar|metodo de pago|metodos de pago|correo paypal',
      'Puedes solicitar CSN IA Pro o Enterprise desde la pestaña Pro. El correo de recepción de PayPal es pampihola5@gmail.com. Copia el correo, abre PayPal y úsalo como destinatario. La activación requiere verificar el pago.'
    );
}

})();

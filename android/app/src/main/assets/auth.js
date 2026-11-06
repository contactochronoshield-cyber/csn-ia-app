(function () {
    if (window.__csnAuthLoaded) return;
    window.__csnAuthLoaded = true;

    var pendingActivation = null;

    var style = document.createElement('style');
    style.textContent = `
      #csn-account-button {
        position:fixed;right:14px;top:14px;z-index:9998;
        background:#123b68;color:white;border:1px solid #2876bb;
        border-radius:22px;padding:10px 16px;font-weight:600;
      }
      #csn-account-overlay {
        display:none;position:fixed;inset:0;z-index:9999;
        background:rgba(0,0,0,.82);padding:18px;
        align-items:center;justify-content:center;
      }
      #csn-account-panel {
        width:100%;max-width:420px;max-height:90vh;overflow:auto;
        background:#101c2b;color:#eaf2ff;border:1px solid #285078;
        border-radius:16px;padding:20px;box-sizing:border-box;
      }
      #csn-account-panel input {
        width:100%;box-sizing:border-box;margin:7px 0 12px;
        padding:12px;border-radius:8px;border:1px solid #36516c;
        background:#0a1420;color:white;font-size:15px;
      }
      #csn-account-panel button {
        border:0;border-radius:8px;padding:11px 14px;
        margin:5px 3px 5px 0;background:#1766a8;color:white;
      }
      #csn-account-panel .secondary {background:#34465a}
      #csn-account-status {font-size:13px;white-space:pre-wrap;color:#a9c9e8;margin-top:12px}
      #csn-account-panel h2 {margin-top:0}
      #csn-account-panel label {font-size:13px;color:#b7cce0}
    `;
    document.head.appendChild(style);

    var button = document.createElement('button');
    button.id = 'csn-account-button';
    button.textContent = 'Cuenta';
    button.onclick = open;
    document.body.appendChild(button);

    var overlay = document.createElement('div');
    overlay.id = 'csn-account-overlay';
    overlay.innerHTML = `
      <div id="csn-account-panel">
        <h2>Chrono Shield Networks</h2>
        <p>Cuenta de usuario y organización</p>

        <h3>Iniciar sesión</h3>
        <label>Correo electrónico</label>
        <input id="csn-login-email" type="email" autocomplete="username">
        <label>Identificador de organización</label>
        <input id="csn-login-org" type="text" autocomplete="off">
        <label>Contraseña</label>
        <input id="csn-login-password" type="password" autocomplete="current-password">
        <button id="csn-login">Iniciar sesión</button>
        <button id="csn-me" class="secondary">Consultar sesión</button>
        <button id="csn-logout" class="secondary">Cerrar sesión</button>

        <hr>

        <h3>Activar organización</h3>
        <label>Clave de licencia</label>
        <input id="csn-license" type="text" autocomplete="off">
        <label>Correo del propietario</label>
        <input id="csn-activate-email" type="email" autocomplete="email">
        <label>Crear contraseña (mínimo 12 caracteres)</label>
        <input id="csn-activate-password" type="password" autocomplete="new-password">
        <button id="csn-activate">Activar organización</button>

        <p id="csn-account-status">Preparado.</p>
        <button id="csn-close" class="secondary">Cerrar</button>
      </div>
    `;
    document.body.appendChild(overlay);

    function bridge() {
        return window.ChronoNetworkBrain || null;
    }

    function open() {
        overlay.style.display = 'flex';
        var b = bridge();

        if (!b) {
            status('Backend no configurado. El chat local sigue disponible.');
            return;
        }

        if (typeof b.me === 'function') {
            b.me('csn_me_' + Date.now());
        }
    }

    function close() {
        overlay.style.display = 'none';
    }

    function status(message) {
        document.getElementById('csn-account-status').textContent = message;
    }

    function callAvailable(method, args) {
        var b = bridge();

        if (!b || typeof b[method] !== 'function') {
            status('El backend HTTPS todavía no está configurado.');
            return false;
        }

        b[method].apply(b, args);
        return true;
    }

    document.getElementById('csn-close').onclick = close;

    document.getElementById('csn-login').onclick = function () {
        var email = document.getElementById('csn-login-email').value.trim();
        var org = document.getElementById('csn-login-org').value.trim();
        var password = document.getElementById('csn-login-password').value;

        callAvailable('login', [
            email, password, org, 'csn_login_' + Date.now()
        ]);
    };

    document.getElementById('csn-activate').onclick = function () {
        var license = document.getElementById('csn-license').value.trim();
        var email = document.getElementById('csn-activate-email').value.trim();
        var password = document.getElementById('csn-activate-password').value;

        if (password.length < 12) {
            status('La contraseña debe tener al menos 12 caracteres.');
            return;
        }

        pendingActivation = {
            email: email,
            password: password
        };

        callAvailable('activate', [
            license, email, password, 'csn_activate_' + Date.now()
        ]);
    };

    document.getElementById('csn-me').onclick = function () {
        callAvailable('me', ['csn_me_' + Date.now()]);
    };

    document.getElementById('csn-logout').onclick = function () {
        callAvailable('logout', ['csn_logout_' + Date.now()]);
    };

    window.onChronoAuthResult = function (id, action, success, value) {
        var result = null;

        if (success) {
            try {
                result = JSON.parse(value);
            } catch (_) {
                result = {};
            }
        }

        if (action === 'activate') {
            if (!success) {
                pendingActivation = null;
                document.getElementById('csn-activate-password').value = '';
                status('No se pudo activar: ' + value);
                return;
            }

            var organizationId =
                result && result.organization ? result.organization.id : '';

            if (!organizationId || !pendingActivation) {
                pendingActivation = null;
                status('Organización activada. Inicia sesión con su identificador.');
                return;
            }

            document.getElementById('csn-login-email').value =
                pendingActivation.email;
            document.getElementById('csn-login-org').value = organizationId;
            document.getElementById('csn-login-password').value =
                pendingActivation.password;

            var email = pendingActivation.email;
            var password = pendingActivation.password;
            pendingActivation = null;

            document.getElementById('csn-activate-password').value = '';

            status('Organización activada. Iniciando sesión…');

            callAvailable('login', [
                email,
                password,
                organizationId,
                'csn_login_after_activation_' + Date.now()
            ]);
            return;
        }

        if (action === 'login' && success) {
            document.getElementById('csn-login-password').value = '';
            status(
                'Sesión iniciada correctamente.\n' +
                'Usuario: ' + ((result.user || {}).email || '') + '\n' +
                'Organización: ' +
                ((result.organization || {}).name || '')
            );
            return;
        }

        if (action === 'me' && success) {
            status(
                'Sesión activa.\n' +
                'Usuario: ' + ((result.user || {}).email || '') + '\n' +
                'Rol: ' + ((result.user || {}).role || '') + '\n' +
                'Organización: ' +
                ((result.organization || {}).name || '')
            );
            return;
        }

        if (action === 'logout' && success) {
            status('Sesión cerrada en este dispositivo.');
            document.getElementById('csn-login-password').value = '';
            return;
        }

        if (!success) {
            if (action === 'login') {
                document.getElementById('csn-login-password').value = '';
            }
            status('Error: ' + value);
        }
    };
})();

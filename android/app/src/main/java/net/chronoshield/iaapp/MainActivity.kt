package net.chronoshield.iaapp

import android.Manifest
import android.app.DownloadManager
import android.os.Build
import android.os.Environment
import android.widget.Toast
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.net.Uri
import android.os.Bundle
import android.os.Looper
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import net.chronoshield.iaapp.ai.ChronoNetworkBrainConfig
import net.chronoshield.iaapp.bridge.ChronoNetworkBrainBridge
import org.json.JSONObject
import java.io.File
import java.io.PrintWriter
import java.io.StringWriter

class MainActivity : AppCompatActivity() {

    private var networkBrainBridge: ChronoNetworkBrainBridge? = null
    private var webView: WebView? = null
    private var locationListener: LocationListener? = null

    private val locationPermissionCode = 7401
    private val wireguardDownloadPermissionCode = 7402
    private val wireguardApkUrl = "https://download.wireguard.com/android-client/com.wireguard.android-1.0.20260315.apk"
    private val locationManager by lazy {
        getSystemService(LOCATION_SERVICE) as LocationManager
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()

        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))
                getExternalFilesDir(null)?.let {
                    File(it, "crash_log.txt").writeText(sw.toString())
                }
            } catch (_: Exception) {
            }
            defaultHandler?.uncaughtException(thread, throwable)
        }

        try {
            val browser = WebView(this)
            webView = browser

            browser.settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                cacheMode = WebSettings.LOAD_NO_CACHE
                setRenderPriority(WebSettings.RenderPriority.LOW)
                allowFileAccessFromFileURLs = false
                allowUniversalAccessFromFileURLs = false
                javaScriptCanOpenWindowsAutomatically = false
            }

            browser.setLayerType(
                android.view.View.LAYER_TYPE_SOFTWARE,
                null
            )

            browser.webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(
                    view: WebView?,
                    request: WebResourceRequest?
                ): Boolean {
                    if (request == null || !request.isForMainFrame) {
                        return false
                    }

                    val uri = request.url
                    if (uri.scheme == "https" || uri.scheme == "http") {
                        return openExternalUrl(uri.toString())
                    }
                    return false
                }
            }

            browser.addJavascriptInterface(
                ChronoLocationBridge(),
                "ChronoLocation"
            )

            browser.addJavascriptInterface(
                CSNDownloadsBridge(),
                "CSNDownloads"
            )

            val endpoint = ChronoNetworkBrainConfig.BASE_URL.trim()
            val endpointUri = Uri.parse(endpoint)

            if (
                endpoint.startsWith("https://") &&
                !endpointUri.host.isNullOrBlank()
            ) {
                networkBrainBridge =
                    ChronoNetworkBrainBridge(browser, endpoint)

                browser.addJavascriptInterface(
                    networkBrainBridge!!,
                    "ChronoNetworkBrain"
                )
            }

            browser.addJavascriptInterface(
                NewsBridge(this) {
                    runOnUiThread {
                        browser.evaluateJavascript(
                            "window.newsReady&&newsReady()",
                            null
                        )
                    }
                },
                "CSNNews"
            )

            browser.addJavascriptInterface(
                SearchBridge { res ->
                    runOnUiThread {
                        browser.evaluateJavascript(
                            "window.searchReady&&searchReady(" +
                                JSONObject.quote(res) + ")",
                            null
                        )
                    }
                },
                "CSNSearch"
            )

            setContentView(browser)
            browser.loadUrl("file:///android_asset/chat.html")

        } catch (e: Throwable) {
            val sw = StringWriter()
            e.printStackTrace(PrintWriter(sw))

            try {
                getExternalFilesDir(null)?.let {
                    File(it, "crash_log.txt").writeText(sw.toString())
                }
            } catch (_: Exception) {
            }

            val tv = TextView(this)
            tv.text = "Error al iniciar:\n\n$e"
            tv.setPadding(40, 100, 40, 40)
            tv.textSize = 12f
            setContentView(tv)
        }
    }

    private inner class ChronoLocationBridge {

        @JavascriptInterface
        fun requestLocation() {
            runOnUiThread {
                val fine = checkSelfPermission(
                    Manifest.permission.ACCESS_FINE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED

                val coarse = checkSelfPermission(
                    Manifest.permission.ACCESS_COARSE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED

                if (!fine && !coarse) {
                    requestPermissions(
                        arrayOf(
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                        ),
                        locationPermissionCode
                    )
                    return@runOnUiThread
                }

                obtainLocation(fine)
            }
        }
    }

    private fun obtainLocation(finePermission: Boolean) {
        try {
            val provider = if (
                finePermission &&
                locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
            ) {
                LocationManager.GPS_PROVIDER
            } else if (
                locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
            ) {
                LocationManager.NETWORK_PROVIDER
            } else if (
                locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
            ) {
                LocationManager.GPS_PROVIDER
            } else {
                sendLocationError("No hay proveedor de ubicación habilitado.")
                return
            }

            val listener = object : LocationListener {
                override fun onLocationChanged(location: Location) {
                    locationListener = null
                    sendLocation(location)
                }

                @Deprecated("Deprecated by Android")
                override fun onStatusChanged(
                    provider: String?,
                    status: Int,
                    extras: Bundle?
                ) {
                }

                override fun onProviderEnabled(provider: String) {
                }

                override fun onProviderDisabled(provider: String) {
                }
            }

            locationListener = listener

            if (
                checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED &&
                checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED
            ) {
                sendLocationError("Permiso de ubicación no concedido.")
                return
            }

            locationManager.requestSingleUpdate(
                provider,
                listener,
                Looper.getMainLooper()
            )

        } catch (e: SecurityException) {
            sendLocationError("Android no autorizó el acceso al GPS.")
        } catch (e: Exception) {
            sendLocationError("Error obteniendo ubicación: ${e.message}")
        }
    }

    private fun sendLocation(location: Location) {
        val result = JSONObject().apply {
            put("success", true)
            put("latitude", location.latitude)
            put("longitude", location.longitude)
            put("accuracy_meters", location.accuracy.toDouble())
            put("altitude_meters", location.altitude)
            put("timestamp", location.time)
            put("provider", location.provider ?: "unknown")
        }

        sendJavascriptResult(result.toString())
    }

    private fun sendLocationError(message: String) {
        val result = JSONObject().apply {
            put("success", false)
            put("error", message)
        }
        sendJavascriptResult(result.toString())
    }

    private fun sendJavascriptResult(value: String) {
        runOnUiThread {
            val safeValue = JSONObject.quote(value)
            webView?.evaluateJavascript(
                "window.onChronoLocationResult && " +
                    "window.onChronoLocationResult($safeValue);",
                null
            )
        }
    }

    @Deprecated("Deprecated by Android")
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(
            requestCode,
            permissions,
            grantResults
        )

        if (requestCode == wireguardDownloadPermissionCode) {
            if (
                grantResults.isNotEmpty() &&
                grantResults[0] == PackageManager.PERMISSION_GRANTED
            ) {
                val result = enqueueWireGuardDownload()
                Toast.makeText(
                    this,
                    result,
                    Toast.LENGTH_LONG
                ).show()
            } else {
                Toast.makeText(
                    this,
                    "Permiso rechazado. No se descargó el APK.",
                    Toast.LENGTH_LONG
                ).show()
            }
            return
        }

        if (requestCode == locationPermissionCode) {
            val fine = checkSelfPermission(
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            val coarse = checkSelfPermission(
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            if (fine || coarse) {
                obtainLocation(fine)
            } else {
                sendLocationError(
                    "Permiso GPS rechazado. Puedes habilitarlo en los ajustes de Android."
                )
            }
        }
    }


    private inner class CSNDownloadsBridge {

        @JavascriptInterface
        fun downloadWireGuard(): String {
            if (
                Build.VERSION.SDK_INT <= Build.VERSION_CODES.P &&
                checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED
            ) {
                runOnUiThread {
                    requestPermissions(
                        arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                        wireguardDownloadPermissionCode
                    )
                }
                return "Android solicitará permiso para guardar el APK."
            }

            return enqueueWireGuardDownload()
        }

        @JavascriptInterface
        fun openDownloads(): String {
            runOnUiThread {
                try {
                    startActivity(
                        Intent(DownloadManager.ACTION_VIEW_DOWNLOADS)
                    )
                } catch (_: Exception) {
                    Toast.makeText(
                        this@MainActivity,
                        "Abre la carpeta Descargas de Android.",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
            return "Abriendo las descargas de Android."
        }

        @JavascriptInterface
        fun openPlayStore(): String {
            runOnUiThread {
                openExternalUrl(
                    "https://play.google.com/store/apps/details?id=com.wireguard.android"
                )
            }
            return "Abriendo Google Play."
        }
    }

    private fun enqueueWireGuardDownload(): String {
        return try {
            val filename =
                "WireGuard-Android-1.0.20260315-" +
                System.currentTimeMillis() + ".apk"

            val request = DownloadManager.Request(
                Uri.parse(wireguardApkUrl)
            )
                .setTitle("WireGuard oficial para Android")
                .setDescription(
                    "Descarga desde el servidor oficial de WireGuard"
                )
                .setMimeType(
                    "application/vnd.android.package-archive"
                )
                .setNotificationVisibility(
                    DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
                )
                .setDestinationInExternalPublicDir(
                    Environment.DIRECTORY_DOWNLOADS,
                    filename
                )
                .setAllowedOverRoaming(false)

            val manager =
                getSystemService(DOWNLOAD_SERVICE) as DownloadManager

            val downloadId = manager.enqueue(request)

            "Descarga iniciada. ID: $downloadId. Consulta su progreso en Descargas."
        } catch (e: Exception) {
            "No se pudo iniciar la descarga: ${e.message ?: "error desconocido"}"
        }
    }

    private fun openExternalUrl(url: String): Boolean {
        return try {
            val uri = Uri.parse(url)
            if (uri.scheme == "https" || uri.scheme == "http") {
                startActivity(Intent(Intent.ACTION_VIEW, uri))
                true
            } else {
                false
            }
        } catch (_: Exception) {
            true
        }
    }

    override fun onDestroy() {
        try {
            locationListener?.let {
                locationManager.removeUpdates(it)
            }
        } catch (_: Exception) {
        }

        locationListener = null
        networkBrainBridge?.shutdown()
        networkBrainBridge = null
        webView = null

        super.onDestroy()
    }
}

package net.chronoshield.iaapp

import android.app.Activity
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast

class CrashActivity : Activity() {
    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        val trace = intent.getStringExtra("trace") ?: "Sin detalles"
        val col = LinearLayout(this)
        col.orientation = LinearLayout.VERTICAL
        col.setPadding(32, 64, 32, 32)
        col.setBackgroundColor(Color.WHITE)
        val h = TextView(this)
        h.text = "CSN IA se cerró por un error.\nToma captura de esta pantalla o toca Copiar y envíala al equipo de CSN."
        h.textSize = 16f
        h.setTextColor(Color.BLACK)
        val sv = ScrollView(this)
        val tv = TextView(this)
        tv.text = trace
        tv.textSize = 11f
        tv.setTextColor(Color.DKGRAY)
        tv.setTextIsSelectable(true)
        sv.addView(tv)
        val cp = Button(this)
        cp.text = "Copiar error"
        cp.setOnClickListener {
            (getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager).setPrimaryClip(ClipData.newPlainText("error", trace))
            Toast.makeText(this, "Copiado", Toast.LENGTH_SHORT).show()
        }
        val cl = Button(this)
        cl.text = "Cerrar"
        cl.setOnClickListener { finishAffinity() }
        col.addView(h)
        col.addView(sv, LinearLayout.LayoutParams(-1, 0, 1f))
        col.addView(cp)
        col.addView(cl)
        setContentView(col)
    }
}

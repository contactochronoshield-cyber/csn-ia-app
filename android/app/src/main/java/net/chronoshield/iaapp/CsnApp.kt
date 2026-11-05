package net.chronoshield.iaapp

import android.app.Application
import android.content.Intent
import java.io.PrintWriter
import java.io.StringWriter

class CsnApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Thread.setDefaultUncaughtExceptionHandler { _, e ->
            try {
                val sw = StringWriter()
                e.printStackTrace(PrintWriter(sw))
                val i = Intent(this, CrashActivity::class.java)
                i.putExtra("trace", sw.toString().take(6000))
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                startActivity(i)
                Thread.sleep(600)
            } catch (x: Throwable) {
            }
            android.os.Process.killProcess(android.os.Process.myPid())
            System.exit(10)
        }
    }
}

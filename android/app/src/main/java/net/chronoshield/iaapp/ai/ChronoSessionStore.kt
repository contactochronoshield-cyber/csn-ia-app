package net.chronoshield.iaapp.ai

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class ChronoSessionStore(context: Context) {

    private val prefs = context.getSharedPreferences(
        "csn_secure_session",
        Context.MODE_PRIVATE
    )

    private val alias = "CSN_SESSION_AES_KEY"

    private fun getKey(): SecretKey {
        val keyStore = KeyStore.getInstance("AndroidKeyStore")
        keyStore.load(null)

        val existing = keyStore.getKey(alias, null) as? SecretKey
        if (existing != null) return existing

        val generator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        )

        generator.init(
            KeyGenParameterSpec.Builder(
                alias,
                KeyProperties.PURPOSE_ENCRYPT or
                    KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(
                    KeyProperties.ENCRYPTION_PADDING_NONE
                )
                .setRandomizedEncryptionRequired(true)
                .build()
        )

        return generator.generateKey()
    }

    @Synchronized
    fun saveToken(token: String) {
        require(token.isNotBlank()) { "Token vacío." }

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, getKey())

        val encrypted = cipher.doFinal(token.toByteArray(Charsets.UTF_8))

        val saved = prefs.edit()
            .putString(
                "iv",
                Base64.encodeToString(cipher.iv, Base64.NO_WRAP)
            )
            .putString(
                "data",
                Base64.encodeToString(encrypted, Base64.NO_WRAP)
            )
            .commit()

        check(saved) { "No se pudo guardar la sesión cifrada." }
    }

    @Synchronized
    fun getToken(): String? {
        val ivText = prefs.getString("iv", null) ?: return null
        val dataText = prefs.getString("data", null) ?: return null

        return try {
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            val iv = Base64.decode(ivText, Base64.NO_WRAP)
            val data = Base64.decode(dataText, Base64.NO_WRAP)

            cipher.init(
                Cipher.DECRYPT_MODE,
                getKey(),
                GCMParameterSpec(128, iv)
            )

            String(cipher.doFinal(data), Charsets.UTF_8)
        } catch (_: Exception) {
            clear()
            null
        }
    }

    @Synchronized
    fun clear() {
        prefs.edit().clear().commit()
    }
}

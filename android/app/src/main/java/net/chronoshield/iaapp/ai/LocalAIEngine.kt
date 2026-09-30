package net.chronoshield.iaapp.ai

/**
 * Motor de inteligencia local de CSN.
 *
 * Esta interfaz permite utilizar diferentes motores:
 * - Knowledge Engine
 * - LLM local
 * - futuros motores especializados
 */
interface LocalAIEngine {

    fun generate(
        prompt: String,
        context: String = ""
    ): String
}

package com.astraarcana.spellcasting

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

/**
 * Main entry point for the Astra Arcana Spellcasting SDK.
 * 
 * Provides methods to interact with the Astra Arcana API for spell casting,
 * ingredient management, and spell visualization.
 *
 * @property apiUrl The base URL of the Astra Arcana API
 */
class SpellcastingSDK(
    private val apiUrl: String = "https://astra-arcana-api.maxk-835.workers.dev"
) {
    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            })
        }
        
    }
    
    /**
     * Closes the HTTP client and releases resources.
     * Should be called when the SDK is no longer needed.
     */
    fun close() {
        httpClient.close()
    }
}
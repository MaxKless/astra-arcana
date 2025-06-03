package spellcasting


import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import spellcasting.api.*
import spellcasting.exceptions.ApiError
import spellcasting.exceptions.IncantationError
import spellcasting.exceptions.IngredientError
import spellcasting.types.*

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
    private val httpClient = HttpClient(OkHttp) {

        defaultRequest {
            contentType(ContentType.Application.Json)
            accept(ContentType.Application.Json)
        }

        expectSuccess = false
    }

    private val json = Json { ignoreUnknownKeys = true }

    /**
     * Fetches all available ingredients from the API.
     *
     * @param filter Optional filter to narrow down results
     * @return List of ingredients matching the filter criteria
     * @throws ApiError if the request fails
     */
    suspend fun getIngredients(filter: IngredientFilter? = null): List<Ingredient> {
        return try {
            val response: HttpResponse = httpClient.get("$apiUrl/api/ingredients") {
                filter?.let { f ->
                    f.name?.let { parameter("name", it) }
                    f.affinity?.let { parameter("affinity", it.name.lowercase()) }
                    f.age?.let { parameter("age", it.name.lowercase()) }
                }
            }

            if (!response.status.isSuccess()) {
                throw ApiError(
                    "Failed to fetch ingredients: ${response.status.description}",
                    statusCode = response.status.value
                )
            }

            json.decodeFromString<List<Ingredient>>(response.bodyAsText())
        } catch (e: Exception) {
            when (e) {
                is ApiError -> throw e
                else -> throw ApiError("Failed to fetch ingredients", cause = e)
            }
        }
    }

    /**
     * Fetches all available incantations from the API.
     *
     * @param filter Optional filter to narrow down results
     * @return List of incantations matching the filter criteria
     * @throws ApiError if the request fails
     */
    suspend fun getIncantations(filter: IncantationFilter? = null): List<Incantation> {
        return try {
            val response: HttpResponse = httpClient.get("$apiUrl/api/incantations") {
                filter?.let { f ->
                    f.name?.let { parameter("name", it) }
                    f.affinity?.let { parameter("affinity", it.name.lowercase()) }
                    f.language?.let { parameter("language", it.name) }
                    f.kind?.let { parameter("kind", it.name.lowercase()) }
                    f.moonphase?.let { parameter("moonphase", it.name.lowercase()) }
                }
            }

            if (!response.status.isSuccess()) {
                throw ApiError(
                    "Failed to fetch incantations: ${response.status.description}",
                    statusCode = response.status.value
                )
            }

            json.decodeFromString<List<Incantation>>(response.bodyAsText())
        } catch (e: Exception) {
            when (e) {
                is ApiError -> throw e
                else -> throw ApiError("Failed to fetch incantations", cause = e)
            }
        }
    }

    /**
     * Fetches all available pre-defined recipes from the API.
     *
     * @return List of all recipes
     * @throws ApiError if the request fails
     */
    suspend fun getRecipes(): List<Recipe> {
        return try {
            val response: HttpResponse = httpClient.get("$apiUrl/api/recipes")

            if (!response.status.isSuccess()) {
                throw ApiError(
                    "Failed to fetch recipes: ${response.status.description}",
                    statusCode = response.status.value
                )
            }

            json.decodeFromString<List<Recipe>>(response.bodyAsText())
        } catch (e: Exception) {
            when (e) {
                is ApiError -> throw e
                else -> throw ApiError("Failed to fetch recipes", cause = e)
            }
        }
    }

    /**
     * Fetches the history of spell casts.
     *
     * @return List of spell logs
     * @throws ApiError if the request fails
     */
    suspend fun getSpellLogs(): List<SpellLog> {
        return try {
            val response: HttpResponse = httpClient.get("$apiUrl/api/spell-logs")

            if (!response.status.isSuccess()) {
                throw ApiError(
                    "Failed to fetch spell logs: ${response.status.description}",
                    statusCode = response.status.value
                )
            }

            json.decodeFromString<List<SpellLog>>(response.bodyAsText())
        } catch (e: Exception) {
            when (e) {
                is ApiError -> throw e
                else -> throw ApiError("Failed to fetch spell logs", cause = e)
            }
        }
    }

    /**
     * Validates that all ingredient names exist and returns their full objects.
     *
     * @param names List of ingredient names to validate
     * @return List of validated ingredients
     * @throws IngredientError if any ingredient name is not found
     */
    suspend fun validateIngredients(names: List<String>): List<Ingredient> {
        val allIngredients = getIngredients()
        val ingredientsByName = allIngredients.associateBy { it.name.lowercase() }

        return names.map { name ->
            ingredientsByName[name.lowercase()]
                ?: throw IngredientError("Ingredient not found: $name")
        }
    }

    /**
     * Validates that all incantation names exist and returns their full objects.
     *
     * @param names List of incantation names to validate
     * @return List of validated incantations
     * @throws IncantationError if any incantation name is not found
     */
    suspend fun validateIncantations(names: List<String>): List<Incantation> {
        val allIncantations = getIncantations()
        val incantationsByName = allIncantations.associateBy { it.name.lowercase() }

        return names.map { name ->
            incantationsByName[name.lowercase()]
                ?: throw IncantationError("Incantation not found: $name")
        }
    }

    /**
     * Finds an ingredient by name (case-insensitive).
     *
     * @param name The ingredient name to search for
     * @return The ingredient if found, null otherwise
     */
    suspend fun findIngredientByName(name: String): Ingredient? {
        return getIngredients().find { it.name.equals(name, ignoreCase = true) }
    }

    /**
     * Finds an incantation by name (case-insensitive).
     *
     * @param name The incantation name to search for
     * @return The incantation if found, null otherwise
     */
    suspend fun findIncantationByName(name: String): Incantation? {
        return getIncantations().find { it.name.equals(name, ignoreCase = true) }
    }

    /**
     * Casts a spell using ingredient and incantation names.
     *
     * @param ingredientNames List of ingredient names
     * @param incantationNames List of incantation names
     * @return The result of the spell cast
     * @throws ApiError if the request fails
     * @throws IngredientError if any ingredient is invalid
     * @throws IncantationError if any incantation is invalid
     */
    suspend fun castSpellByNames(
        ingredientNames: List<String>,
        incantationNames: List<String>
    ): CastSpellResponse {
        return try {
            val response: HttpResponse = httpClient.post("$apiUrl/api/cast") {
                setBody(json.encodeToString(CastSpellRequest(ingredientNames, incantationNames)))
            }

            if (!response.status.isSuccess()) {
                throw ApiError(
                    "Failed to cast spell: ${response.status.description}",
                    statusCode = response.status.value
                )
            }

            json.decodeFromString<CastSpellResponse>(response.bodyAsText())
        } catch (e: Exception) {
            when (e) {
                is ApiError -> throw e
                else -> throw ApiError("Failed to cast spell", cause = e)
            }
        }
    }

    /**
     * Casts a spell using ingredient and incantation objects.
     *
     * @param ingredients List of ingredients
     * @param incantations List of incantations
     * @return The result of the spell cast
     * @throws ApiError if the request fails
     */
    suspend fun castSpell(
        ingredients: List<Ingredient>,
        incantations: List<Incantation>
    ): CastSpellResponse {
        return castSpellByNames(
            ingredients.map { it.name },
            incantations.map { it.name }
        )
    }

    /**
     * Visualizes a spell without casting it using ingredient and incantation names.
     *
     * @param ingredientNames List of ingredient names
     * @param incantationNames List of incantation names
     * @return Visualization data for the spell
     * @throws ApiError if the request fails
     */
    suspend fun visualizeSpellByNames(
        ingredientNames: List<String>,
        incantationNames: List<String>
    ): SpellVisualizationData {
        return try {
            val response: HttpResponse = httpClient.post("$apiUrl/api/visualize") {
                setBody(json.encodeToString(VisualizeSpellRequest(ingredientNames, incantationNames)))
            }

            if (!response.status.isSuccess()) {
                throw ApiError(
                    "Failed to visualize spell: ${response.status.description}",
                    statusCode = response.status.value
                )
            }

            json.decodeFromString<SpellVisualizationData>(response.bodyAsText())
        } catch (e: Exception) {
            when (e) {
                is ApiError -> throw e
                else -> throw ApiError("Failed to visualize spell", cause = e)
            }
        }
    }

    /**
     * Visualizes a spell without casting it using ingredient and incantation objects.
     *
     * @param ingredients List of ingredients
     * @param incantations List of incantations
     * @return Visualization data for the spell
     * @throws ApiError if the request fails
     */
    suspend fun visualizeSpell(
        ingredients: List<Ingredient>,
        incantations: List<Incantation>
    ): SpellVisualizationData {
        return visualizeSpellByNames(
            ingredients.map { it.name },
            incantations.map { it.name }
        )
    }

    /**
     * Closes the HTTP client and releases resources.
     * Should be called when the SDK is no longer needed.
     */
    fun close() {
        httpClient.close()
    }
}

package spellcasting.api

import kotlinx.serialization.Serializable
import spellcasting.types.*

@Serializable
data class IngredientsResponse(
    val ingredients: List<Ingredient>
)

@Serializable
data class IncantationsResponse(
    val incantations: List<Incantation>
)

@Serializable
data class RecipesResponse(
    val recipes: List<Recipe>
)

@Serializable
data class SpellLogsResponse(
    val logs: List<SpellLog>
)

@Serializable
data class CastSpellRequest(
    val ingredients: List<String>,
    val incantations: List<String>
)

@Serializable
data class VisualizeSpellRequest(
    val ingredients: List<String>,
    val incantations: List<String>
)

@Serializable
data class CastSpellResponse(
    val success: Boolean,
    val message: String,
    val timestamp: String,
    val details: SpellDetails,
    val spellResult: CompleteSpellResult
)

@Serializable
data class SpellDetails(
    val ingredients_count: Int,
    val incantations_count: Int
)

@Serializable
data class CompleteSpellResult(
    val success: Boolean,
    val successRate: Double,
    val power: Double,
    val duration: Double,
    val dominantElement: Element? = null,
    val elementalBalance: Map<Element, Double>,
    val interactionModifier: Double,
    val ingredients: List<String?>,
    val incantations: List<String?>,
    val effects: List<ElementEffect>,
    val specialEffect: SpecialEffect? = null,
    val effectStrength: Double,
    val durationDescription: String,
    val successDescription: String,
    val spellDescription: String
)

@Serializable
data class ElementEffect(
    val element: Element,
    val effect: String,
    val strength: String,
    val proportion: Double
)

@Serializable
data class SpecialEffect(
    val name: String,
    val description: String,
    val elements: String? = null,
    val element: Element? = null
)

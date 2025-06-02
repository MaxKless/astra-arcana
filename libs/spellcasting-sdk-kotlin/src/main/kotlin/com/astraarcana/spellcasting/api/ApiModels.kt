package com.astraarcana.spellcasting.api

import com.astraarcana.spellcasting.types.*
import kotlinx.serialization.Serializable

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
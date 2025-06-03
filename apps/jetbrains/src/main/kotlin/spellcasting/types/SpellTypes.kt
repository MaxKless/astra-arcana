package spellcasting.types

import kotlinx.serialization.Serializable

@Serializable
data class SpellEffect(
    val type: String,
    val description: String,
    val strength: String
)

@Serializable
data class SpellResult(
    val success: Boolean,
    val effects: List<SpellEffect>,
    val description: String,
    val visualization: SpellVisualizationData
)

@Serializable
data class SpellLog(
    val id: String,
    val timestamp: String,
    val ingredients: List<Ingredient>,
    val incantations: List<Incantation>,
    val result: SpellResult
)

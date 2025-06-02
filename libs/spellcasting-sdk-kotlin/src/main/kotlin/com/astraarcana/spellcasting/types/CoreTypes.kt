package com.astraarcana.spellcasting.types

import kotlinx.serialization.Serializable

@Serializable
data class Ingredient(
    val name: String,
    val affinity: Element,
    val age: Age? = null
)

@Serializable
data class Incantation(
    val name: String,
    val language: Language,
    val affinity: Element? = null,
    val kind: SpellKind,
    val moonphase: MoonPhase? = null
)

@Serializable
data class Recipe(
    val name: String,
    val origin: String,
    val ingredients: List<Ingredient>,
    val incantations: List<Incantation>
)
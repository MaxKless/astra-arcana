package com.astraarcana.spellcasting.api

import com.astraarcana.spellcasting.types.*

data class IngredientFilter(
    val name: String? = null,
    val affinity: Element? = null,
    val age: Age? = null
)

data class IncantationFilter(
    val name: String? = null,
    val affinity: Element? = null,
    val language: Language? = null,
    val kind: SpellKind? = null,
    val moonphase: MoonPhase? = null
)
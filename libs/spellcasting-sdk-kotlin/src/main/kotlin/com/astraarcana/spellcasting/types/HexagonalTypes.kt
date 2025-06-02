package com.astraarcana.spellcasting.types

import kotlinx.serialization.Serializable

@Serializable
data class ElementRelationship(
    val opposite: Element,
    val neighbors: List<Element>,
    val baseValue: Int = 5
)

@Serializable
data class ElementInteraction(
    val element1: Element,
    val element2: Element,
    val modifier: Double
)

@Serializable
data class SpellVisualizationData(
    val elementalBalance: Map<Element, Double>,
    val interactions: List<ElementInteraction>,
    val interactionModifier: Double,
    val successRate: Double,
    val power: Double,
    val duration: Double,
    val complexity: Double,
    val dominantElement: Element? = null
)

@Serializable
data class HexagonPosition(
    val angle: Double,
    val x: Double,
    val y: Double
)
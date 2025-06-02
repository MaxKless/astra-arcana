package com.astraarcana.spellcasting.types

object Constants {
    val ELEMENTAL_RELATIONSHIPS = mapOf(
        Element.FIRE to ElementRelationship(
            opposite = Element.WATER,
            neighbors = listOf(Element.AIR, Element.EARTH),
            baseValue = 5
        ),
        Element.WATER to ElementRelationship(
            opposite = Element.FIRE,
            neighbors = listOf(Element.EARTH, Element.AETHER),
            baseValue = 5
        ),
        Element.EARTH to ElementRelationship(
            opposite = Element.AIR,
            neighbors = listOf(Element.FIRE, Element.WATER),
            baseValue = 5
        ),
        Element.AIR to ElementRelationship(
            opposite = Element.EARTH,
            neighbors = listOf(Element.FIRE, Element.VOID),
            baseValue = 5
        ),
        Element.AETHER to ElementRelationship(
            opposite = Element.VOID,
            neighbors = listOf(Element.WATER, Element.VOID),
            baseValue = 5
        ),
        Element.VOID to ElementRelationship(
            opposite = Element.AETHER,
            neighbors = listOf(Element.AIR, Element.AETHER),
            baseValue = 5
        )
    )

    val ELEMENT_COLORS = mapOf(
        Element.FIRE to ElementColor(
            primary = "#FF4E4E",
            secondary = "#FF8A8A",
            tertiary = "#FFD1D1"
        ),
        Element.WATER to ElementColor(
            primary = "#4E8CFF",
            secondary = "#8AB0FF",
            tertiary = "#D1E1FF"
        ),
        Element.EARTH to ElementColor(
            primary = "#8B5A3C",
            secondary = "#B8866D",
            tertiary = "#E5D1C1"
        ),
        Element.AIR to ElementColor(
            primary = "#7DD87D",
            secondary = "#A3E7A3",
            tertiary = "#D9F5D9"
        ),
        Element.AETHER to ElementColor(
            primary = "#B76EFF",
            secondary = "#D09FFF",
            tertiary = "#EBD6FF"
        ),
        Element.VOID to ElementColor(
            primary = "#666666",
            secondary = "#999999",
            tertiary = "#CCCCCC"
        )
    )

    val HEXAGON_ELEMENT_POSITIONS = mapOf(
        Element.FIRE to HexagonPosition(angle = 90.0, x = 100.0, y = 50.0),
        Element.WATER to HexagonPosition(angle = 270.0, x = 100.0, y = 150.0),
        Element.EARTH to HexagonPosition(angle = 210.0, x = 50.0, y = 125.0),
        Element.AIR to HexagonPosition(angle = 30.0, x = 150.0, y = 75.0),
        Element.AETHER to HexagonPosition(angle = 330.0, x = 150.0, y = 125.0),
        Element.VOID to HexagonPosition(angle = 150.0, x = 50.0, y = 75.0)
    )
}

data class ElementColor(
    val primary: String,
    val secondary: String,
    val tertiary: String
)
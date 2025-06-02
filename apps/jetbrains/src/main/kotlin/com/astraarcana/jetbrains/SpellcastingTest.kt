package com.astraarcana.jetbrains

import com.astraarcana.spellcasting.SpellcastingSDK
import com.astraarcana.spellcasting.types.*

/**
 * Test class to verify that the Spellcasting SDK types can be imported and used
 */
class SpellcastingTest {
    
    fun testSDKImports() {
        // Create SDK instance
        val sdk = SpellcastingSDK()
        
        // Test creating ingredients
        val dragonScale = Ingredient(
            name = "Dragon Scale",
            affinity = Element.FIRE,
            age = Age.ANCIENT
        )
        
        val moonwater = Ingredient(
            name = "Moonwater",
            affinity = Element.WATER,
            age = Age.FRESH
        )
        
        // Test creating incantations
        val fireballIncantation = Incantation(
            name = "Ignis Sphera",
            language = Language.LATIN,
            affinity = Element.FIRE,
            kind = SpellKind.SPELL,
            moonphase = MoonPhase.FULL
        )
        
        // Test creating a recipe
        val fireballRecipe = Recipe(
            name = "Fireball",
            origin = "Ancient Pyromancy Texts",
            ingredients = listOf(dragonScale),
            incantations = listOf(fireballIncantation)
        )
        
        // Test accessing constants
        val fireRelationship = Constants.ELEMENTAL_RELATIONSHIPS[Element.FIRE]
        val fireColor = Constants.ELEMENT_COLORS[Element.FIRE]
        val firePosition = Constants.HEXAGON_ELEMENT_POSITIONS[Element.FIRE]
        
        println("Fire element opposite: ${fireRelationship?.opposite}")
        println("Fire element neighbors: ${fireRelationship?.neighbors}")
        println("Fire primary color: ${fireColor?.primary}")
        println("Fire hexagon position: x=${firePosition?.x}, y=${firePosition?.y}")
        
        // Clean up
        sdk.close()
    }
}
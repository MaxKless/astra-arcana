package com.astraarcana.jetbrains.actions

import com.astraarcana.spellcasting.SpellcastingSDK
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.diagnostic.Logger
import kotlinx.coroutines.runBlocking

class SimpleSpellCastAction : AnAction("Cast Test Spell") {
    
    companion object {
        private val logger = Logger.getInstance(SimpleSpellCastAction::class.java)
    }
    
    override fun actionPerformed(e: AnActionEvent) {
        val sdk = SpellcastingSDK()
        
        try {
            runBlocking {
                // First, let's find some valid ingredients and incantations
                val ingredients = sdk.getIngredients()
                val incantations = sdk.getIncantations()
                
                if (ingredients.isEmpty() || incantations.isEmpty()) {
                    logger.error("No ingredients or incantations available!")
                    return@runBlocking
                }
                
                // Use the first few available items for testing
                val testIngredients = ingredients.take(2).map { it.name }
                val testIncantations = incantations.take(1).map { it.name }
                
                logger.info("Testing with ingredients: $testIngredients")
                logger.info("Testing with incantations: $testIncantations")
                
                // Cast spell with valid ingredients
                val result = sdk.castSpellByNames(
                    ingredientNames = testIngredients,
                    incantationNames = testIncantations
                )
                
                logger.info("=== Spell Cast Result ===")
                logger.info("Success: ${result.success}")
                logger.info("Message: ${result.message}")
                logger.info("Timestamp: ${result.timestamp}")
                logger.info("Ingredients used: ${result.details.ingredients_count}")
                logger.info("Incantations used: ${result.details.incantations_count}")
                
                val spellResult = result.spellResult
                logger.info("\n=== Spell Details ===")
                logger.info("Power: ${spellResult.power}")
                logger.info("Duration: ${spellResult.duration} (${spellResult.durationDescription})")
                logger.info("Success Rate: ${spellResult.successRate} (${spellResult.successDescription})")
                logger.info("Dominant Element: ${spellResult.dominantElement ?: "None"}")
                
                logger.info("\n=== Effects ===")
                spellResult.effects.forEach { effect ->
                    logger.info("  - ${effect.element}: ${effect.effect} (${effect.strength})")
                }
                
                spellResult.specialEffect?.let { effect ->
                    logger.info("\n=== Special Effect ===")
                    logger.info("${effect.name}: ${effect.description}")
                }
                
                logger.info("\n=== Description ===")
                logger.info(spellResult.spellDescription)
            }
        } catch (ex: Exception) {
            logger.error("Failed to cast spell", ex)
        } finally {
            sdk.close()
        }
    }
}
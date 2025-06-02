package com.astraarcana.jetbrains.actions

import com.astraarcana.spellcasting.SpellcastingSDK
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.diagnostic.Logger
import kotlinx.coroutines.runBlocking

class SimpleLogAction : AnAction("Log Ingredients") {
    
    companion object {
        private val logger = Logger.getInstance(SimpleLogAction::class.java)
    }
    
    override fun actionPerformed(e: AnActionEvent) {
        val sdk = SpellcastingSDK()
        
        try {
            runBlocking {
                val ingredients = sdk.getIngredients()
                
                logger.info("=== Fetched ${ingredients.size} ingredients ===")
                ingredients.forEach { ingredient ->
                    logger.info("${ingredient.name} - ${ingredient.affinity}")
                }
            }
        } catch (ex: Exception) {
            logger.error("Failed to fetch ingredients", ex)
        } finally {
            sdk.close()
        }
    }
}
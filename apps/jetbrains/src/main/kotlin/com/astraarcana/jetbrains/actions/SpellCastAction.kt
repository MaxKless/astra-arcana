package com.astraarcana.jetbrains.actions

import com.astraarcana.jetbrains.utils.selectFromList
import com.intellij.notification.NotificationGroupManager
import com.intellij.notification.NotificationType
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.EDT
import com.intellij.openapi.components.Service
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import spellcasting.SpellcastingSDK

class SpellCastAction : AnAction() {
  override fun actionPerformed(p0: AnActionEvent) {
    val project = p0.project ?: return

    project.service<SpellCastService>().castSpell()
  }
}

@Service(Service.Level.PROJECT)
class SpellCastService(private val project: Project, private val coroutineScope: CoroutineScope) {
  fun castSpell() {
    coroutineScope.launch {
      val sdk = SpellcastingSDK()

      try {

        val ingredients = sdk.getIngredients()
        val selectedIngredients =
            withContext(Dispatchers.EDT) {
              selectFromList(ingredients.map { it.name }, "Select Ingredients")
            }
        val incantations = sdk.getIncantations()
        val selectedIncantations =
            withContext(Dispatchers.EDT) {
              selectFromList(incantations.map { it.name }, "Select Incantations")
            }

        val result = sdk.castSpellByNames(selectedIngredients, selectedIncantations)

        withContext(Dispatchers.EDT) {
          NotificationGroupManager.getInstance()
              .getNotificationGroup("Astra Arcana")
              .createNotification(
                  "Spell cast ${if(result.success) "successfully" else "failed"}",
                  if (result.success) NotificationType.INFORMATION else NotificationType.ERROR)
              .notify(project)
        }
      } catch (e: Throwable) {
        // do something
      } finally {
        sdk.close()
      }
    }
  }
}

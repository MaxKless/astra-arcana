package com.astraarcana.jetbrains.actions

import com.intellij.notification.NotificationGroupManager
import com.intellij.notification.NotificationType
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.EDT
import com.intellij.openapi.components.Service
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.popup.JBPopupFactory
import com.intellij.util.ui.JBUI
import kotlinx.coroutines.*
import spellcasting.SpellcastingSDK
import java.awt.Dimension
import javax.swing.ListSelectionModel.MULTIPLE_INTERVAL_SELECTION
import javax.swing.ListSelectionModel.SINGLE_SELECTION
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class SpellCastAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
      val project = e.project ?: return

      SpellCastService.getInstance(project).castSpell()
    }
}

@Service(Service.Level.PROJECT)
class SpellCastService(val project: Project, private val coroutineScope: CoroutineScope) {

  fun castSpell() {
     coroutineScope.launch {
       withContext(Dispatchers.EDT) {
         val sdk = SpellcastingSDK()

         try {
           val ingredients = sdk.getIngredients()
           val selectedIngredients = selectFromList(
             items = ingredients.map { it.name },
             title = "Select Ingredients"
           )

           val incantations = sdk.getIncantations()
           val selectedIncantations = selectFromList(
             items = incantations.map { it.name },
             title = "Select Incantations"
           )

           val result = sdk.castSpellByNames(
             ingredientNames = selectedIngredients,
             incantationNames = selectedIncantations
           )

             NotificationGroupManager.getInstance().getNotificationGroup("Astra Arcana").createNotification(
               "Spell cast successfully: ${result.message}", NotificationType.INFORMATION
             ).notify(project)

         } catch (ex: Exception) {
           thisLogger().error("Failed to cast spell", ex)
         } finally {
           sdk.close()
         }
       }
     }
  }

  private suspend fun selectFromList(
    items: List<String>,
    title: String,
  )  = suspendCoroutine<List<String>> { continuation ->
      val popup =
        JBPopupFactory.getInstance()
          .createPopupChooserBuilder(items)
          .setTitle(title)
          .setSelectionMode(MULTIPLE_INTERVAL_SELECTION)
          .setRequestFocus(true)
          .setFilterAlwaysVisible(true)
          .setResizable(true)
          .setMovable(true)
          .setItemsChosenCallback { chosen ->
            continuation.resume(chosen?.toList() ?: emptyList())
          }
          .createPopup()

      popup.showInFocusCenter()

  }

  companion object {
    fun getInstance(project: Project): SpellCastService =
      project.getService(SpellCastService::class.java)
  }
}

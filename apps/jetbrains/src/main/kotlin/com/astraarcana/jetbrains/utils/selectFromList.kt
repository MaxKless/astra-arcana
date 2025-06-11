package com.astraarcana.jetbrains.utils

import com.intellij.openapi.ui.popup.JBPopupFactory
import javax.swing.ListSelectionModel.MULTIPLE_INTERVAL_SELECTION
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

suspend fun selectFromList(items: List<String>, title: String) =
    suspendCoroutine<List<String>> { continuation ->
      val popup =
          JBPopupFactory.getInstance()
              .createPopupChooserBuilder(items)
              .setTitle(title)
              .setSelectionMode(MULTIPLE_INTERVAL_SELECTION)
              .setRequestFocus(true)
              .setResizable(true)
              .setMovable(true)
              .setItemsChosenCallback { chosen ->
                continuation.resume(chosen?.toList() ?: emptyList())
              }
              .createPopup()

      popup.showInFocusCenter()
    }

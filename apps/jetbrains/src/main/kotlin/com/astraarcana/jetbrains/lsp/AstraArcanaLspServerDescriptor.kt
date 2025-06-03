package com.astraarcana.jetbrains.lsp

import com.intellij.execution.configurations.GeneralCommandLine
import com.intellij.javascript.nodejs.interpreter.NodeCommandLineConfigurator
import com.intellij.javascript.nodejs.interpreter.NodeJsInterpreterManager
import com.intellij.javascript.nodejs.library.yarn.pnp.YarnPnpManager
import com.intellij.lang.javascript.service.JSLanguageServiceUtil
import com.intellij.lang.typescript.compiler.languageService.TypeScriptLanguageServiceUtil
import com.intellij.lang.typescript.lsp.JSLspServerDescriptor
import com.intellij.lang.typescript.lsp.LspServerLoader
import com.intellij.lang.typescript.lsp.LspServerPackageDescriptor
import com.intellij.lang.typescript.lsp.PackageVersion
import com.intellij.openapi.application.readAction
import com.intellij.openapi.diagnostic.thisLogger
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.openapi.vfs.VirtualFileManager
import com.intellij.platform.lsp.api.ProjectWideLspServerDescriptor
import com.intellij.platform.lsp.api.customization.LspCompletionSupport
import java.io.File
import java.nio.file.Paths
import java.util.concurrent.ExecutionException

class AstraArcanaLspServerDescriptor(project: Project) : ProjectWideLspServerDescriptor(project, "Astra Arcana") {
    override val lspCompletionSupport = LspCompletionSupport()

  override fun isSupportedFile(file: VirtualFile): Boolean {
    return TypeScriptLanguageServiceUtil.IS_VALID_FILE_FOR_SERVICE.value(file)
  }

  override fun createCommandLine(): GeneralCommandLine {
    val lsp =
      JSLanguageServiceUtil.getPluginDirectory(this.javaClass, "language-server/main.js")
    if (lsp == null || !lsp.exists()) {
      throw Throwable("Unable to find lsp main.js file")
    }

    thisLogger().info("nxls found via ${lsp.path}")
    return GeneralCommandLine().apply {
      withParentEnvironmentType(GeneralCommandLine.ParentEnvironmentType.CONSOLE)

      withCharset(Charsets.UTF_8)
      workDirectory = File(project.basePath)
      addParameter(lsp.path)
      addParameter("--stdio")

      NodeCommandLineConfigurator.find(NodeJsInterpreterManager.getInstance(project).interpreter ?: throw Throwable("Couldnt find node interpreter")).configure(this)
    }
  }

}


package com.astraarcana.jetbrains.lsp

import com.intellij.lang.typescript.compiler.languageService.TypeScriptLanguageServiceUtil
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.platform.lsp.api.LspServerSupportProvider

class AstraArcanaLspServerSupportProvider : LspServerSupportProvider {
    override fun fileOpened(
        project: Project,
        file: VirtualFile,
        serverStarter: LspServerSupportProvider.LspServerStarter
    ) {
        if (TypeScriptLanguageServiceUtil.IS_VALID_FILE_FOR_SERVICE.value(file)) {
            serverStarter.ensureServerStarted(AstraArcanaLspServerDescriptor(project))
        }
    }
}

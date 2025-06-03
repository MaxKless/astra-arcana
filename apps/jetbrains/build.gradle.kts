plugins {
    id("java")
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.serialization") version "2.0.20"
    id("org.jetbrains.intellij.platform") version "2.6.0"
    id("dev.nx.gradle.project-graph") version("0.1.0")
}

group = "com.astra-arcana"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

// Configure Gradle IntelliJ Plugin
// Read more: https://plugins.jetbrains.com/docs/intellij/tools-intellij-platform-gradle-plugin.html
dependencies {

  implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.2")

    intellijPlatform {
        intellijIdeaUltimate("2025.1")

        // Add necessary plugin dependencies for compilation here, example:
         bundledPlugin("JavaScript")
    }
}

intellijPlatform {
    pluginConfiguration {
        ideaVersion {
            sinceBuild = "242"
        }

        changeNotes = """
      Initial version
    """.trimIndent()
    }
}

// Define source location of built language server
val languageServerRoot = "${rootDir}/../language-server/dist"

tasks {
    // Set the JVM compatibility versions
    withType<JavaCompile> {
        sourceCompatibility = "21"
        targetCompatibility = "21"
    }
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "21"
    }

    prepareSandbox {
        from(languageServerRoot) {
            include("main.js")
            into(intellijPlatform.projectName.map { "$it/language-server" }.get())
        }
    }
}


allprojects {
    apply {
        plugin("kotlin")
    }

    repositories {
        mavenCentral()
    }
}

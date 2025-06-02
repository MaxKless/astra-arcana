plugins {
    id("dev.nx.gradle.project-graph") version("0.1.0")
}

group = "com.astra-arcana"

allprojects {
    apply {
        plugin("dev.nx.gradle.project-graph")
    }
  }

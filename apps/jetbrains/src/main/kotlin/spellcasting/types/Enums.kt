package spellcasting.types

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
enum class Element {
    @SerialName("fire")
    FIRE,
    @SerialName("water")
    WATER,
    @SerialName("earth")
    EARTH,
    @SerialName("air")
    AIR,
    @SerialName("aether")
    AETHER,
    @SerialName("void")
    VOID
}

@Serializable
enum class Age {
    @SerialName("ancient")
    ANCIENT,
    @SerialName("old")
    OLD,
    @SerialName("fresh")
    FRESH
}

@Serializable
enum class Language {
    @SerialName("English")
    ENGLISH,
    @SerialName("Spanish")
    SPANISH,
    @SerialName("Latin")
    LATIN,
    @SerialName("Old English")
    OLD_ENGLISH,
    @SerialName("Old Norse")
    OLD_NORSE,
    @SerialName("Sanskrit")
    SANSKRIT,
    @SerialName("Other")
    OTHER
}

@Serializable
enum class MoonPhase {
    @SerialName("new")
    NEW,
    @SerialName("waxing")
    WAXING,
    @SerialName("full")
    FULL,
    @SerialName("waning")
    WANING
}

@Serializable
enum class SpellKind {
    @SerialName("ritual")
    RITUAL,
    @SerialName("spell")
    SPELL,
    @SerialName("support")
    SUPPORT,
    @SerialName("sacrifice")
    SACRIFICE,
    @SerialName("other")
    OTHER
}

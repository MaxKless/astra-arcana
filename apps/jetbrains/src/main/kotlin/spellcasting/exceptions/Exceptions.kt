package spellcasting.exceptions

open class SpellcastingException(message: String, cause: Throwable? = null) : Exception(message, cause)

class IngredientError(message: String, cause: Throwable? = null) : SpellcastingException(message, cause)

class IncantationError(message: String, cause: Throwable? = null) : SpellcastingException(message, cause)

class ApiError(
    message: String,
    val statusCode: Int? = null,
    cause: Throwable? = null
) : SpellcastingException(message, cause)

package com.astraarcana.spellcasting

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class SpellcastingSDKTest {
    
    @Test
    fun `SDK can be instantiated with default URL`() {
        val sdk = SpellcastingSDK()
        assertNotNull(sdk)
        sdk.close()
    }
    
    @Test
    fun `SDK can be instantiated with custom URL`() {
        val customUrl = "https://custom.api.url"
        val sdk = SpellcastingSDK(customUrl)
        assertNotNull(sdk)
        sdk.close()
    }
}
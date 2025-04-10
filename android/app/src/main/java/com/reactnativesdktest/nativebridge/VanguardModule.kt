package com.reactnativesdktest.nativebridge

import android.widget.Toast
import android.util.Log
import com.facebook.react.bridge.*
import id.co.vostra.vanguard.dpc.Vanguard_SDK
import id.co.vostra.vanguard.sdk.VanguardService
import id.co.vostra.vanguard.sdk.VanguardServiceCallback

class VanguardModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var vanguardSdk: Vanguard_SDK? = null
    private var isConnected = false

    init {
        val service = VanguardService(reactContext)
        service.connectToService(object : VanguardServiceCallback {
            override fun onConnected(sdk: Vanguard_SDK) {
                vanguardSdk = sdk
                isConnected = true
                Toast.makeText(reactContext, "Service connected", Toast.LENGTH_SHORT).show()
                Log.d("VanguardModule", "Service connected")
            }

            override fun onFailed(e: Exception) {
                vanguardSdk = null
                isConnected = false
                Toast.makeText(reactContext, "Connection failed: ${e.message}", Toast.LENGTH_SHORT).show()
                Log.e("VanguardModule", "Connection failed", e)
            }
        })
    }

    override fun getName(): String {
        return "VanguardModule"
    }

    @ReactMethod
    fun isSdkReady(promise: Promise) {
        promise.resolve(isConnected)
    }

    @ReactMethod
    fun getWifiMacAddress(promise: Promise) {
        if (vanguardSdk != null) {
            try {
                val mac = vanguardSdk?.wifiMacAddress ?: "null"
                promise.resolve(mac)
                Toast.makeText(reactContext, "MAC: $mac", Toast.LENGTH_SHORT).show()
                Log.d("VanguardModule", "getWifiMacAddress: $mac")
            } catch (e: Exception) {
                promise.reject("ERROR", e)
            }
        } else {
            promise.reject("NOT_CONNECTED", "Service not connected")
        }
    }

    @ReactMethod
    fun getDeviceSerialNumber(promise: Promise) {
        if (vanguardSdk != null) {
            try {
                val serial = vanguardSdk?.deviceSerialNumber ?: "null"
                promise.resolve(serial)
                Toast.makeText(reactContext, "Serial: $serial", Toast.LENGTH_SHORT).show()
                Log.d("VanguardModule", "getDeviceSerialNumber: $serial")
            } catch (e: Exception) {
                promise.reject("ERROR", e)
            }
        } else {
            promise.reject("NOT_CONNECTED", "Service not connected")
        }
    }
}

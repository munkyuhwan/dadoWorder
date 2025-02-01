package com.metacity

import android.os.Bundle
import android.os.Handler
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
    var timeThread: Thread? = null
    var handler: Handler? = null

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String {
        return "MetaCity"
    }

    /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class [ ] which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
            mainComponentName,  // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            fabricEnabled
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) // 화면 켜짐 유지
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
        onScreenTouch()
    }


    override fun dispatchTouchEvent(ev: MotionEvent): Boolean {
        if (ev.action == MotionEvent.ACTION_DOWN) {
            if (timeThread != null) timeThread!!.interrupt()
            if (handler != null) handler!!.removeCallbacksAndMessages(null)
            handler = null

            timeThread = null
            onScreenTouch()
        }
        return super.dispatchTouchEvent(ev)
    }

    protected fun onScreenBrightnessChange(brightness: Float?) {
        val params = window.attributes
        params.screenBrightness = brightness!!
        runOnUiThread { window.attributes = params }
    }

    protected fun onScreenTouch() {
        /*
        onScreenBrightnessChange(0.7f)
        if (timeThread != null) timeThread!!.interrupt()
        timeThread = null
        if (handler != null) handler!!.removeCallbacksAndMessages(null)
        handler = null

        timeThread = Thread {
            runOnUiThread {
                handler = Handler()
                handler!!.postDelayed({
                    onScreenBrightnessChange(0.05f)
                    if (timeThread != null) timeThread.interrupt()
                    timeThread = null
                    handler = null
                }, 240000)
            }
        }
        timeThread!!.start()

         */
    }

}

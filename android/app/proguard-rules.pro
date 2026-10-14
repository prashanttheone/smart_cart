# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in getDefaultProguardFile("proguard-android-optimize.txt")

# Keep source file names and line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature,InnerClasses,EnclosingMethod

# --- React Native Core & JNI ---
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep @com.facebook.common.internal.DoNotStrip class * { *; }
-keepclassmembers class * {
    @com.facebook.common.internal.DoNotStrip *;
}

-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }

# React Native New Architecture (Fabric & TurboModules)
-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule {
    @com.facebook.react.bridge.ReactMethod *;
}

# Hermes Engine
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.** { *; }

# --- React Native Reanimated ---
-keep class com.swmansion.reanimated.** { *; }

# --- React Native Gesture Handler & Screens ---
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.rnscreens.** { *; }

# --- React Native SVG ---
-keep class com.horcrux.svg.** { *; }

# --- React Native Keychain ---
-keep class com.oblador.keychain.** { *; }

# --- React Native Async Storage ---
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# --- Notifee ---
-keep class app.notifee.** { *; }
-keepclassmembers class app.notifee.** { *; }

# --- Firebase (Messaging, Analytics, App) ---
-dontwarn com.google.firebase.**
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# --- OkHttp & Networking ---
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.jetbrains.annotations.**

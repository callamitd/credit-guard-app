import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function BiometricAuth() {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);

    const handleLogin = async () => {
        try {
            const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
            if (!savedBiometrics) {
                return Alert.alert(
                    'Biometric Record Not Found',
                    'Please verify your identity with your password',
                    [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }] // Fallback for demo
                );
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login with FaceID',
                fallbackLabel: 'Use Passcode',
            });

            if (result.success) {
                router.replace('/(tabs)/home');
            } else {
                Alert.alert('Authentication failed', 'Please try again');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('An error occurred', 'Please try again later');
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-slate-900 p-4">
            <View className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
                <Text className="text-3xl font-bold text-white text-center mb-2">
                    Credit Guard
                </Text>
                <Text className="text-slate-400 text-center mb-8">
                    Secure Credit Management
                </Text>

                <TouchableOpacity
                    onPress={handleLogin}
                    className="w-full bg-blue-600 py-4 rounded-xl active:bg-blue-700"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        {isBiometricSupported ? 'Login with FaceID' : 'Login'}
                    </Text>
                </TouchableOpacity>

                {!isBiometricSupported && (
                    <Text className="text-slate-500 text-center mt-4 text-xs">
                        Biometrics not supported on this device
                    </Text>
                )}
            </View>
        </View>
    );
}

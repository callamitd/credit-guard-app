import { useState } from 'react';
import { sendOtp, verifyOtp } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const router = useRouter();

    const handleGetOtp = async () => {
        if (mobileNumber.length === 10) {
            try {
                await sendOtp(mobileNumber);
                setShowOtpInput(true);
                Alert.alert('OTP Sent', 'Please check your mobile for the OTP');
            } catch (error: any) {
                Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
            }
        } else {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length === 4) {
            try {
                const response = await verifyOtp(mobileNumber, otp);
                if (response.token) {
                    await AsyncStorage.setItem('token', response.token);
                }
                router.replace('/(tabs)/home');
            } catch (error: any) {
                Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
            }
        } else {
            Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center p-6"
            >
                <View className="items-center mb-10">
                    {/* Placeholder for Logo */}
                    {/* Logo */}
                    <View className="w-32 h-32 bg-slate-800 rounded-full items-center justify-center mb-6 shadow-lg shadow-blue-500/20 border-4 border-slate-700 overflow-hidden">
                        <Image
                            source={require('../assets/logo.png')}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="text-3xl font-bold text-white">Credit Guard</Text>
                    <Text className="text-slate-400 mt-2">Secure Retailer Management</Text>
                </View>

                <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                    {!showOtpInput ? (
                        <>
                            <Text className="text-slate-400 mb-2 ml-1">Mobile Number</Text>
                            <View className="flex-row items-center mb-6">
                                <View className="bg-slate-700 px-4 py-4 rounded-l-xl border-r border-slate-600">
                                    <Text className="text-white font-semibold">+91</Text>
                                </View>
                                <TextInput
                                    className="flex-1 bg-slate-700 text-white px-4 py-4 rounded-r-xl text-lg"
                                    placeholder="98765 43210"
                                    placeholderTextColor="#64748b"
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    autoFocus
                                    value={mobileNumber}
                                    onChangeText={(text) => setMobileNumber(text.replace(/[^0-9]/g, ''))}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleGetOtp}
                                className="bg-blue-600 py-4 rounded-xl active:bg-blue-700 shadow-lg shadow-blue-900/50"
                            >
                                <Text className="text-white text-center font-bold text-lg">Get OTP</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text className="text-slate-400 mb-2 ml-1">Enter OTP</Text>
                            <TextInput
                                className="bg-slate-700 text-white px-4 py-4 rounded-xl text-lg text-center tracking-widest mb-6 font-bold"
                                placeholder="• • • •"
                                placeholderTextColor="#64748b"
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                                autoFocus
                                value={otp}
                                onChangeText={setOtp}
                            />
                            <TouchableOpacity
                                onPress={handleVerifyOtp}
                                className="bg-green-600 py-4 rounded-xl active:bg-green-700 shadow-lg shadow-green-900/50 mb-4"
                            >
                                <Text className="text-white text-center font-bold text-lg">Verify OTP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setShowOtpInput(false)}
                            >
                                <Text className="text-slate-400 text-center">Change Mobile Number</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

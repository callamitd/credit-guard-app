import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(true);

    const validatePhoneNumber = (number: string) => {
        // Indian phone number regex: Starts with 6-9 and has 10 digits
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(number);
    };

    const handleSave = () => {
        if (validatePhoneNumber(phoneNumber)) {
            Alert.alert('Success', 'Phone number updated successfully!');
            setIsValid(true);
        } else {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian mobile number.');
            setIsValid(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="p-4">
                    <Text className="text-white text-2xl font-bold mb-6">My Profile</Text>

                    <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
                        <Text className="text-slate-400 text-sm mb-2">Full Name</Text>
                        <Text className="text-white text-lg font-semibold mb-4">Amit Deshpande</Text>

                        <Text className="text-slate-400 text-sm mb-2">Mobile Number (India)</Text>
                        <View className="flex-row items-center mb-2">
                            <View className="bg-slate-700 px-3 py-3 rounded-l-xl border-r border-slate-600">
                                <Text className="text-white font-semibold">+91</Text>
                            </View>
                            <TextInput
                                className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-r-xl"
                                placeholder="98765 43210"
                                placeholderTextColor="#64748b"
                                keyboardType="number-pad"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={(text) => {
                                    setPhoneNumber(text.replace(/[^0-9]/g, ''));
                                    setIsValid(true);
                                }}
                            />
                        </View>
                        {!isValid && (
                            <Text className="text-red-400 text-xs mb-2">
                                Enter a valid 10-digit Indian mobile number starting with 6-9.
                            </Text>
                        )}

                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-blue-600 py-3 rounded-xl mt-4 active:bg-blue-700"
                        >
                            <Text className="text-white text-center font-semibold">Update Profile</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <Text className="text-slate-400 text-sm mb-2">Address</Text>
                        <Text className="text-white text-base">
                            123, Tech Park Road,{'\n'}
                            Koramangala, Bangalore,{'\n'}
                            Karnataka - 560034
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

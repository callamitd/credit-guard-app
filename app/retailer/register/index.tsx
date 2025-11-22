import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegistration } from '../../../context/RegistrationContext';
import { useState } from 'react';

export default function BasicDetailsScreen() {
    const router = useRouter();
    const { data, updateData } = useRegistration();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!data.name) newErrors.name = 'Name is required';
        if (!data.shopName) newErrors.shopName = 'Shop Name is required';
        if (!data.mobile || !/^[6-9]\d{9}$/.test(data.mobile)) newErrors.mobile = 'Valid Indian mobile number is required';
        if (!data.address) newErrors.address = 'Address is required';
        if (data.aadhaar && !/^\d{12}$/.test(data.aadhaar)) newErrors.aadhaar = 'Aadhaar number must be 12 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            router.push('/retailer/register/photo');
        } else {
            Alert.alert('Validation Error', 'Please fill all required fields correctly.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-slate-900"
        >
            <ScrollView className="p-4">
                <Text className="text-slate-400 mb-6 text-center">Step 1 of 4: Basic Details</Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-slate-300 mb-1 ml-1">Retailer Name *</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                            placeholder="Enter full name"
                            placeholderTextColor="#64748b"
                            autoFocus
                            value={data.name}
                            onChangeText={(text) => updateData({ name: text })}
                        />
                        {errors.name && <Text className="text-red-400 text-xs ml-1 mt-1">{errors.name}</Text>}
                    </View>

                    <View>
                        <Text className="text-slate-300 mb-1 ml-1">Shop Name *</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                            placeholder="Enter shop name"
                            placeholderTextColor="#64748b"
                            value={data.shopName}
                            onChangeText={(text) => updateData({ shopName: text })}
                        />
                        {errors.shopName && <Text className="text-red-400 text-xs ml-1 mt-1">{errors.shopName}</Text>}
                    </View>

                    <View>
                        <Text className="text-slate-300 mb-1 ml-1">Mobile Number *</Text>
                        <View className="flex-row">
                            <View className="bg-slate-800 p-4 rounded-l-xl border-r border-slate-700 border-y border-l">
                                <Text className="text-white">+91</Text>
                            </View>
                            <TextInput
                                className="flex-1 bg-slate-800 text-white p-4 rounded-r-xl border border-slate-700"
                                placeholder="98765 43210"
                                placeholderTextColor="#64748b"
                                keyboardType="number-pad"
                                maxLength={10}
                                value={data.mobile}
                                onChangeText={(text) => updateData({ mobile: text.replace(/[^0-9]/g, '') })}
                            />
                        </View>
                        {errors.mobile && <Text className="text-red-400 text-xs ml-1 mt-1">{errors.mobile}</Text>}
                    </View>

                    <View>
                        <Text className="text-slate-300 mb-1 ml-1">Address / Pincode *</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                            placeholder="Enter full address"
                            placeholderTextColor="#64748b"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            value={data.address}
                            onChangeText={(text) => updateData({ address: text })}
                        />
                        {errors.address && <Text className="text-red-400 text-xs ml-1 mt-1">{errors.address}</Text>}
                    </View>

                    <View>
                        <Text className="text-slate-300 mb-1 ml-1">GSTIN (Optional)</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                            placeholder="Enter GSTIN"
                            placeholderTextColor="#64748b"
                            autoCapitalize="characters"
                            value={data.gstin}
                            onChangeText={(text) => updateData({ gstin: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-slate-300 mb-1 ml-1">Aadhaar Number (Optional)</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                            placeholder="XXXX XXXX XXXX"
                            placeholderTextColor="#64748b"
                            keyboardType="number-pad"
                            maxLength={12}
                            secureTextEntry
                            value={data.aadhaar}
                            onChangeText={(text) => updateData({ aadhaar: text.replace(/[^0-9]/g, '') })}
                        />
                        {errors.aadhaar && <Text className="text-red-400 text-xs ml-1 mt-1">{errors.aadhaar}</Text>}
                    </View>
                </View>

                <View className="flex-row gap-4 mt-8 mb-10">
                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)/home')}
                        className="flex-1 bg-slate-700 py-4 rounded-xl active:bg-slate-600"
                    >
                        <Text className="text-white text-center font-bold text-lg">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleNext}
                        className="flex-1 bg-blue-600 py-4 rounded-xl active:bg-blue-700 shadow-lg"
                    >
                        <Text className="text-white text-center font-bold text-lg">Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

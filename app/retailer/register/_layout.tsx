import { Stack } from 'expo-router';
import { RegistrationProvider } from '../../../context/RegistrationContext';

export default function RegistrationLayout() {
    return (
        <RegistrationProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#1e293b' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                    contentStyle: { backgroundColor: '#0f172a' },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'Step 1: Basic Details' }} />
                <Stack.Screen name="photo" options={{ title: 'Step 2: Capture Photo' }} />
                <Stack.Screen name="consent" options={{ title: 'Step 3: Consent' }} />
                <Stack.Screen name="success" options={{ headerShown: false }} />
            </Stack>
        </RegistrationProvider>
    );
}

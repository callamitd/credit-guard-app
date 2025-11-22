import { createContext, useContext, useState, ReactNode } from 'react';

interface RegistrationData {
    name: string;
    shopName: string;
    mobile: string;
    address: string;
    gstin: string;
    aadhaar: string;
    photoUri: string | null;
    location: {
        latitude: number;
        longitude: number;
    } | null;
    timestamp: string | null;
}

interface RegistrationContextType {
    data: RegistrationData;
    updateData: (updates: Partial<RegistrationData>) => void;
    resetData: () => void;
}

const defaultData: RegistrationData = {
    name: '',
    shopName: '',
    mobile: '',
    address: '',
    gstin: '',
    aadhaar: '',
    photoUri: null,
    location: null,
    timestamp: null,
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<RegistrationData>(defaultData);

    const updateData = (updates: Partial<RegistrationData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const resetData = () => {
        setData(defaultData);
    };

    return (
        <RegistrationContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </RegistrationContext.Provider>
    );
}

export function useRegistration() {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }
    return context;
}

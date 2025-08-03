import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import hrReducer from '../features/hr/hrSlice'
import onboardingReducer from '../features/onboarding/onboardingSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        hr: hrReducer,
        onboarding: onboardingReducer, 
    },
    devTools: import.meta.env.MODE !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
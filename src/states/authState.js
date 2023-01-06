import create from "zustand";
import { checkLoginService } from "../services/AuthService";
export const useAuthStore = create((set, get) => ({
    error: false,
    setError: (value) => set(() => ({ error: value })),
    successLogin: false,
    //setSuccessLogin: (value) => set(() => ({ successLogin: value })),
    loginDetails: localStorage.getItem('loginDetails'),
    checkLogin: async (params) => {
        const data =   await checkLoginService({ params });
        if(data.length > 0){
            set({ error: false })
            set({ successLogin: true })
        }else{
           set({ error: true })
        }
    },
}));

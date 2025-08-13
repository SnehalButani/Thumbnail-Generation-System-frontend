import { useDispatch, useSelector } from "react-redux";
import { loginAction, signUpAction, uploadFileAction } from "@/store/action/auth.action";
import type { AppDispatch, RootState } from "../store";
import { clearMessage } from "@/store/reducers/auth.reducer";


const useAuthentication = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, message, apiName, alertType, isAuthenticated, jobs } = useSelector(
        (state: RootState) => state.auth,
    );

    const signUp = (name: string, email: string, password: string) => dispatch(signUpAction({ name, email, password }));
    const login = (email: string, password: string) => dispatch(loginAction({ email, password }));
    const uploadFile = (formData: FormData) => dispatch(uploadFileAction(formData));
    const closeAlert = () => dispatch(clearMessage());

    return {
        loading,
        message,
        apiName,
        alertType,
        isAuthenticated,
        jobs,
        login,
        signUp,
        uploadFile,
        closeAlert,
    };
};

export default useAuthentication;

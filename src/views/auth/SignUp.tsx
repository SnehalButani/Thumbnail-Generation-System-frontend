import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PasswordInput from "@/components/PasswordInput";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AlertMessage from "@/components/AlertMessage";
import useAuthentication from "@/hooks/useAuthentication";
import { signupSchema } from "@/schemas/schema";

const SignUp = () => {
  const { signUp, alertType, apiName, message, closeAlert, loading } =
    useAuthentication();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    await signUp(data.username, data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {apiName === "sign-up" && message && alertType && (
          <AlertMessage
            message={message}
            type={
              alertType as "success" | "error" | "warning" | "alert" | "info"
            }
            onClose={closeAlert}
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <Controller
                name="username"
                control={control}
                disabled={loading === "sign-up"}
                render={({ field }) => (
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <Controller
                name="email"
                control={control}
                disabled={loading === "sign-up"}
                render={({ field }) => (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <Controller
                name="password"
                control={control}
                disabled={loading === "sign-up"}
                render={({ field }) => (
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                    onBlur={field.onBlur}
                    autoComplete="new-password"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                Terms of Service
              </a>
            </label>
          </div>

          <div className="flex justify-center items-center">
            <Button
              type="submit"
              fullWidth
              disabled={loading === "sign-up"}
              loading={loading === "sign-up"}
            >
              Create Account
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

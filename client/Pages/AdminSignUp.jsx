import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AdminSignup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Account created successfully!");
      reset();
    } catch {
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white border border-gray-300 shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Admin Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  className="w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  {...register("firstName", { required: "First name is required", minLength: { value: 2, message: "Must be at least 2 characters" } })}
                />
                {errors.firstName && <p className="text-xs text-gray-500 mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  className="w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  {...register("lastName", { required: "Last name is required", minLength: { value: 2, message: "Must be at least 2 characters" } })}
                />
                {errors.lastName && <p className="text-xs text-gray-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
          </div>

          {/* Email & Organization */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-black"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-xs text-gray-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <div>
              <label className="block text-sm font-medium">Organization</label>
              <input
                className="w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-black"
                {...register("organization", { required: "Organization is required" })}
              />
              {errors.organization && <p className="text-xs text-gray-500 mt-1">{errors.organization.message}</p>}
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Account Security</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  {...register("password", { required: "Password is required", minLength: { value: 8, message: "Must be at least 8 characters" } })}
                />
                {errors.password && <p className="text-xs text-gray-500 mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-400 rounded p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) => value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && <p className="text-xs text-gray-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            {isLoading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;

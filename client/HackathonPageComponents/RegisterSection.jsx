import { useState } from "react";

export default function RegisterSection() {
  const [activeRole, setActiveRole] = useState(null);
  const [formType, setFormType] = useState("signup"); // 'signup' or 'login'

  const roles = ["Hacker", "Sponsor", "Judge", "Organizer", "Admin"];

  // Common input styles
  const inputClass =
    "border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-black";
  const btnClass =
    "bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition";

  // Role-specific form fields
  const formFields = {
    Hacker: {
      signup: [
        { type: "text", placeholder: "Name" },
        { type: "email", placeholder: "Email" },
        { type: "text", placeholder: "Phone Number" },
        { type: "password", placeholder: "Password" },
      ],
      login: [
        { type: "text", placeholder: "Name" },
        { type: "password", placeholder: "Password" },
      ],
    },
    Judge: {
      signup: [
        { type: "text", placeholder: "Name" },
        { type: "email", placeholder: "Email" },
        { type: "text", placeholder: "Phone Number" },
        { type: "password", placeholder: "Password" },
      ],
      login: [
        { type: "text", placeholder: "Name" },
        { type: "password", placeholder: "Password" },
      ],
    },
    Organizer: {
      signup: [
        { type: "text", placeholder: "Name" },
        { type: "email", placeholder: "Email" },
        { type: "text", placeholder: "Phone Number" },
        { type: "password", placeholder: "Password" },
      ],
      login: [
        { type: "text", placeholder: "Name" },
        { type: "password", placeholder: "Password" },
      ],
    },
    Sponsor: {
      signup: [
        { type: "text", placeholder: "Sponsor Name" },
        { type: "text", placeholder: "Invite Code" },
        { type: "password", placeholder: "Password" },
      ],
      login: [
        { type: "text", placeholder: "Sponsor Name" },
        { type: "text", placeholder: "Invite Code" },
      ],
    },
    Admin: {
      login: [
        { type: "text", placeholder: "Name" },
        { type: "password", placeholder: "Password" },
      ],
    },
  };

  const renderFormFields = () => {
    const fields = formFields[activeRole]?.[formType] || [];
    return (
      <>
        {fields.map((field, idx) => (
          <input
            key={idx}
            type={field.type}
            placeholder={field.placeholder}
            className={inputClass}
          />
        ))}
        <button className={btnClass}>
          {formType === "signup" ? "Sign Up" : "Login"}
        </button>
      </>
    );
  };

  return (
    <div className="p-6 px-40 border border-gray-300 rounded-lg bg-white shadow mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      {/* Role Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => {
              setActiveRole(role);
              setFormType(role === "Admin" ? "login" : "signup");
            }}
            className={`px-4 py-2 rounded-lg border transition ${
              activeRole === role
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black hover:bg-gray-100"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Signup/Login Toggle */}
      {activeRole && activeRole !== "Admin" && (
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setFormType("signup")}
            className={`${formType === "signup" ? "font-bold underline" : ""}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setFormType("login")}
            className={`${formType === "login" ? "font-bold underline" : ""}`}
          >
            Login
          </button>
        </div>
      )}

      {/* Form Fields */}
      <div className="flex flex-col gap-3">
        {activeRole && renderFormFields()}
      </div>
    </div>
  );
}

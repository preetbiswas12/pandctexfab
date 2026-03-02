import { useEffect } from "react";

export default function SignUpPage() {
  // Redirect to Clerk's hosted Account Portal
  useEffect(() => {
    window.location.href = "https://accounts.auraclothings.qzz.io/sign-up";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#030213] mb-2">Redirecting to Sign Up...</h2>
        <p className="text-gray-600">If you are not redirected automatically, please wait.</p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#030213]"></div>
        </div>
      </div>
    </div>
  );
}

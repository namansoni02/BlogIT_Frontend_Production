import { useNavigate } from "react-router-dom";

export default function LoginBox() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">MonkNet Login</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" placeholder="Email" className="input input-bordered w-full" />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="password" placeholder="Password" className="input input-bordered w-full" />
        </div>

        <button className="btn btn-primary w-full mb-3">Login</button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

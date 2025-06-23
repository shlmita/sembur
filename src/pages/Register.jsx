import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: null, // cegah auto-login dari Supabase
      },
    });

    if (signUpError) {
      setError("Registrasi gagal: " + signUpError.message);
      return;
    }

    const userId = signUpData.user?.id;

    if (!userId) {
      setError("Registrasi berhasil, tapi akun belum aktif. Silakan cek email konfirmasi.");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert([{ id: userId, full_name: fullName }], { onConflict: "id" });

    if (profileError) {
      setError("Gagal menyimpan data profil: " + profileError.message);
      return;
    }

    // Langsung logout agar user tidak langsung login
    await supabase.auth.signOut();

    navigate("/login");
  };

  return (
    <form onSubmit={handleRegister} className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Register
      </button>

      <p className="mt-4 text-sm text-center text-gray-600">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
};

export default Register;

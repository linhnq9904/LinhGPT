import { useState } from "react";

type Props = {
  onLogin: (token: string, user: any) => void;
  onGoRegister: () => void;
};

function LoginPage({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost/Backend/Api/auth/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    onLogin(data.token, data.user);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">
        Đăng nhập
      </h1>

      <input
        className="w-full border rounded-lg px-4 py-3 mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
      />

      <input
        className="w-full border rounded-lg px-4 py-3 mb-4"
        placeholder="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-black text-white rounded-lg py-3"
      >
        Đăng nhập
      </button>

      <p className="text-center mt-4 text-sm">
        Chưa có tài khoản?{" "}
        <button onClick={onGoRegister} className="underline">
          Đăng ký
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
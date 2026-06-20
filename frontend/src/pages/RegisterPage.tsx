import { useState } from "react";

type Props = {
  onGoLogin: () => void;
};

function RegisterPage({ onGoLogin }: Props) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost/Backend/Api/auth/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullname, email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert("Đăng ký thành công, hãy đăng nhập");
    onGoLogin();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">
        Đăng ký
      </h1>

      <input
        className="w-full border rounded-lg px-4 py-3 mb-3"
        placeholder="Họ tên"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleRegister();
          }
        }}
      />

      <input
        className="w-full border rounded-lg px-4 py-3 mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleRegister();
          }
        }}
      />

      <input
        className="w-full border rounded-lg px-4 py-3 mb-4"
        placeholder="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-black text-white rounded-lg py-3"
      >
        Đăng ký
      </button>

      <p className="text-center mt-4 text-sm">
        Đã có tài khoản?{" "}
        <button onClick={onGoLogin} className="underline">
          Đăng nhập
        </button>
      </p>
    </div>
  );
}

export default RegisterPage;
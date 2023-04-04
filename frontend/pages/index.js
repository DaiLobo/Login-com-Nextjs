import React, { useState } from "react";

import { useRouter } from "next/router";

import { authService } from "../src/services/auth/authService";

export default function HomeScreen() {
  const router = useRouter();
  const [values, setValues] = useState({
    usuario: "dianarose",
    senha: "safepassword",
  });

  const [hovered, setHovered] = useState(false);

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  function handleChange(event) {
    const fieldValue = event.target.value;
    const fieldName = event.target.name;
    setValues((currentValues) => {
      return {
        ...currentValues,
        [fieldName]: fieldValue,
      };
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "#8442f5" }}>Login</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          authService
            .login({
              username: values.usuario,
              password: values.senha,
            })
            .then(() => {
              // router.push("/auth-page-static");
              router.push("/auth-page-ssr");
            })
            .catch((error) => {
              alert("Usuário ou senha estão inválidos");
            });
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <input
          placeholder="Usuário"
          name="usuario"
          value={values.usuario}
          onChange={handleChange}
          style={{ width: 200, marginBottom: 10, alignSelf: "center" }}
        />
        <input
          placeholder="Senha"
          name="senha"
          type="password"
          value={values.senha}
          onChange={handleChange}
          style={{ width: 200, marginBottom: 15, alignSelf: "center" }}
        />
        {/* <pre>
          {JSON.stringify(values, null, 2)}
        </pre> */}
        <div>
          <button
            style={{
              backgroundColor: hovered ? "#6a48b9" : "#3f0b99",
              color: "#ffffff",
              paddingLeft: 15,
              paddingRight: 15,
              padding: 5,
              cursor: "pointer",
              transition: "background-color 0.3s ease-in-out",
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

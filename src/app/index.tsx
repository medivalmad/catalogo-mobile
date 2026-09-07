import { useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleLogin() {
  if (email.trim() === "" || senha.trim() === "") {
    setErro("Preencha todos os campos.");
    return;
  }

  setErro("");

  dispatch(login(email));

  router.replace("/catalogo");
}

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Catálogo Mobile</Text>

        <Text style={styles.subtitle}>
          Entre para acessar nossos produtos
        </Text>

        <Text style={styles.label}>E-mail</Text>

        <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
          />
        

        {erro !== "" && (
          <Text style={styles.errorText}>{erro}</Text>
        )}
          <Pressable
              style={styles.button}
              onPress={handleLogin}
          >
          <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  loginBox: {
    width: "100%",
    maxWidth: 400,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },

  button: {
  height: 50,
  backgroundColor: "#111111",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
},

buttonText: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "bold",
},

errorText: {
  color: "#cc0000",
  fontSize: 14,
  marginBottom: 12,
},

});
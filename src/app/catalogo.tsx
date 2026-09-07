import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

import type { RootState } from "../store/store";
import { logout } from "../store/userSlice";
import api from "../services/api";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export default function Catalogo() {
  const email = useSelector((state: RootState) => state.user.email);
  const logged = useSelector((state: RootState) => state.user.logged);

  const dispatch = useDispatch();

  const [genero, setGenero] = useState<"masculino" | "feminino">(
    "masculino"
  );

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("mens-shirts");

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const categoriasMasculinas = [
    { nome: "Camisas", valor: "mens-shirts" },
    { nome: "Calçados", valor: "mens-shoes" },
    { nome: "Relógios", valor: "mens-watches" },
  ];

  const categoriasFemininas = [
    { nome: "Bolsas", valor: "womens-bags" },
    { nome: "Vestidos", valor: "womens-dresses" },
    { nome: "Joias", valor: "womens-jewellery" },
    { nome: "Calçados", valor: "womens-shoes" },
    { nome: "Relógios", valor: "womens-watches" },
  ];

  const categorias =
    genero === "masculino"
      ? categoriasMasculinas
      : categoriasFemininas;

  function handleLogout() {
    dispatch(logout());
    router.replace("/");
  }

  function selecionarGenero(novoGenero: "masculino" | "feminino") {
    setGenero(novoGenero);

    if (novoGenero === "masculino") {
      setCategoriaSelecionada("mens-shirts");
    } else {
      setCategoriaSelecionada("womens-bags");
    }
  }

  async function buscarProdutos() {
    try {
      setCarregando(true);
      setErro("");

      const response = await api.get(
        `/products/category/${categoriaSelecionada}`
      );

      setProdutos(response.data.products);
    } catch (error) {
      setErro("Não foi possível carregar os produtos.");
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarProdutos();
  }, [categoriaSelecionada]);

  useEffect(() => {
  if (!logged) {
    router.replace("/");
  }
}, [logged]);

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Catálogo de Produtos</Text>
          <Text>Olá, {email}!</Text>
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </Pressable>
      </View>

      {/* GÊNERO */}
      <View style={styles.genderContainer}>
        <Pressable
          style={[
            styles.genderButton,
            genero === "masculino" && styles.genderButtonActive,
          ]}
          onPress={() => selecionarGenero("masculino")}
        >
          <Text
            style={[
              styles.genderText,
              genero === "masculino" && styles.genderTextActive,
            ]}
          >
            Masculino
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.genderButton,
            genero === "feminino" && styles.genderButtonActive,
          ]}
          onPress={() => selecionarGenero("feminino")}
        >
          <Text
            style={[
              styles.genderText,
              genero === "feminino" && styles.genderTextActive,
            ]}
          >
            Feminino
          </Text>
        </Pressable>
      </View>

      {/* CATEGORIAS */}
      <Text style={styles.sectionTitle}>Categorias</Text>

      <View style={styles.categoriesContainer}>
        {categorias.map((categoria) => {
          const ativa =
            categoriaSelecionada === categoria.valor;

          return (
            <Pressable
              key={categoria.valor}
              style={[
                styles.categoryButton,
                ativa && styles.categoryButtonActive,
              ]}
              onPress={() =>
                setCategoriaSelecionada(categoria.valor)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  ativa && styles.categoryTextActive,
                ]}
              >
                {categoria.nome}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* CARREGAMENTO */}
      {carregando && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Carregando produtos...</Text>
        </View>
      )}

      {/* ERRO */}
      {!carregando && erro !== "" && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{erro}</Text>
        </View>
      )}

      {/* PRODUTOS */}
      {!carregando && erro === "" && (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={styles.productCard}
              onPress={() =>
                router.push(`/produto/${item.id}`)
              }
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.productImage}
              />

              <Text style={styles.productTitle}>
                {item.title}
              </Text>

              <Text style={styles.productPrice}>
                US$ {item.price.toFixed(2)}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },

  logoutButton: {
    backgroundColor: "#111111",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  genderContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },

  genderButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },

  genderButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#111111",
  },

  genderText: {
    color: "#777777",
    fontSize: 16,
  },

  genderTextActive: {
    color: "#111111",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 20,
  },

  categoryButtonActive: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },

  categoryText: {
    color: "#333333",
  },

  categoryTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  errorText: {
    color: "#cc0000",
  },

  list: {
    paddingBottom: 20,
  },

  row: {
    gap: 15,
  },

  productCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },

  productImage: {
    width: "100%",
    height: 170,
    resizeMode: "contain",
    marginBottom: 10,
  },

  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  productPrice: {
    fontSize: 15,
  },
});
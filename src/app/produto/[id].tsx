import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import api from "../../services/api";

type ProductDetails = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
};

export default function ProdutoDetalhes() {
  const { id } = useLocalSearchParams();

  const [produto, setProduto] = useState<ProductDetails | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function buscarProduto() {
    try {
      setCarregando(true);
      setErro("");

      const response = await api.get(`/products/${id}`);

      setProduto(response.data);
    } catch (error) {
      setErro("Não foi possível carregar os detalhes do produto.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarProduto();
  }, [id]);

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (erro !== "") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{erro}</Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  if (!produto) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>

      <View style={styles.card}>
        <Image
          source={{ uri: produto.thumbnail }}
          style={styles.image}
        />

        <Text style={styles.title}>
          {produto.title}
        </Text>

        <Text style={styles.description}>
          {produto.description}
        </Text>

        <Text style={styles.price}>
          US$ {produto.price.toFixed(2)}
        </Text>

        <Text style={styles.discount}>
          Desconto: {produto.discountPercentage.toFixed(2)}%
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  card: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
  },

  image: {
    width: "100%",
    height: 350,
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  discount: {
    fontSize: 16,
    marginBottom: 20,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#111111",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },

  backButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  errorText: {
    color: "#cc0000",
    marginBottom: 16,
  },
});
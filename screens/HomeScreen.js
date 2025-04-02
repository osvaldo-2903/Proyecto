import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [articulos, setArticulos] = useState([]);
  const navigation = useNavigation();

  // Leer artículos desde Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('articulos')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticulos(items);
      });

    return () => unsubscribe();
  }, []);

  // Eliminar artículo
  const eliminarArticulo = id => {
    Alert.alert('Eliminar', '¿Deseas Eliminar este artículo?', [
      { text: 'cancelar', style: 'cancel' },
      {
        text: 'sí, eliminar articulo',
        style: 'destructive',
        onPress: () => firestore().collection('articulos').doc(id).delete(),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.articulo}>
      <Text style={styles.texto}>{item.nombre} - ${item.precio}</Text>
      <View style={styles.botones}>
        <TouchableOpacity onPress={() => navigation.navigate('Editar', { item })}>
          <Text style={styles.btnEditar}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarArticulo(item.id)}>
          <Text style={styles.btnEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botonCrear} onPress={() => navigation.navigate('Crear')}>
        <Text style={styles.btnTexto}>➕ Crear artículo</Text>
      </TouchableOpacity>

      <FlatList
        data={articulos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay artículos aún.</Text>}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  articulo: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 },
  texto: { fontSize: 16 },
  botones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  btnEditar: { color: 'blue' },
  btnEliminar: { color: 'red' },
  botonCrear: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  btnTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

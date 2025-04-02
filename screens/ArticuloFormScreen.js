import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ArticuloFormScreen = ({ navigation, route }) => {
  const editing = route.params?.item !== undefined;
  const item = route.params?.item;

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (editing) {
      setNombre(item.nombre);
      setPrecio(item.precio.toString());
      setDescripcion(item.descripcion);
    }
  }, [item]);

  const guardarArticulo = async () => {
    if (!nombre || !precio) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const articulo = {
      nombre,
      precio: parseFloat(precio),
      descripcion,
    };

    try {
      if (editing) {
        await firestore().collection('articulos').doc(item.id).update(articulo);
        Alert.alert('Éxito', 'Artículo actualizado');
      } else {
        await firestore().collection('articulos').add(articulo);
        Alert.alert('Éxito', 'Artículo creado');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar' : 'Crear'} artículo</Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={guardarArticulo}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ArticuloFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const Income = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [nominal, setNominal] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('income');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const addData = (nominal, desc, type, date) => {
    if (date == '' || nominal == '' || desc == '') {
      Alert.alert('Mohon isi seluruh field!');
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO Finance (nominal, desc, type, created_at) VALUES (?,?,?,?)',
            [nominal, desc, type, date.toLocaleDateString('en-CA')],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                Alert.alert(
                  'Sukses',
                  'Data berhasil ditambahkan!',
                  [
                    {
                      text: 'Ok',
                      onPress: () => navigation.goBack(),
                    },
                  ],
                  { cancelable: false }
                );
              } else alert('Error saat menambahkan data!');
            }
          );
          tx.executeSql('select * from Finance', [], (_, { rows }) =>
            console.log(JSON.stringify(rows))
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Tambah Pemasukan</Text>
      <View
        style={{
          margin: 15,
          borderRadius: 20,
          backgroundColor: '#fff',
          width: '90%',
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          paddingVertical: 30,
        }}>
        <View style={{ margin: 10 }}>
          <Text style={styles.labelText}>Tanggal</Text>
          <DateTimePicker
            style={{ width: '100%' }}
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChange}
            placeholderText="Select Date"
          />
        </View>
        <View style={{ margin: 10 }}>
          <Text style={styles.labelText}>Nominal</Text>
          <TextInput
            mode="outlined"
            label="Nominal"
            placeholder="Nominal"
            keyboardType="number-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            style={styles.inputStyles}
            value={nominal}
            onChangeText={(nominal) => setNominal(nominal)}
          />
        </View>
        <View style={{ margin: 10 }}>
          <Text style={styles.labelText}>Keterangan</Text>
          <TextInput
            mode="outlined"
            label="Keterangan"
            placeholder="Keterangan"
            returnKeyType="next"
            blurOnSubmit={false}
            style={styles.inputStyles}
            value={desc}
            onChangeText={(desc) => setDesc(desc)}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          addData(nominal, desc, type, date);
        }}
        style={styles.btnSuccess}>
        <Text style={styles.btnLabel}>Simpan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.btnDanger}>
        <Text style={styles.btnLabel}>&lt;&lt; Kembali</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Income;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5cb85c',
    marginTop: 10,
    marginBottom: 20,
  },
  inputStyles: {
    paddingLeft: 10,
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  labelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  btnSuccess: {
    width: '85%',
    height: 40,
    backgroundColor: '#5cb85c',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDanger: {
    width: '85%',
    height: 40,
    backgroundColor: '#d9534f',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

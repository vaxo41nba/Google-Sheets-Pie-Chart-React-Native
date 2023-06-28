import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import axios from 'axios';
import PieChart from 'react-native-pie-chart';

export default function App() {
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const formatObj = (obj) => {
    const keys = obj.values[0];
    const data = obj.values.slice(1);
    const array = data.map((arr) =>
      Object.assign({}, ...keys.map((k, i) => ({ [k]: arr[i] })))
    );
    setList(array);
  };

  const getData = () => {
    setRefreshing(true);

    const SHEET_ID = '1zhsZpsuNjb1xLJ7DTmIwpf1BqRc6fSZDoi_aWeQ1Na8';
    const SHEET_NAME = 'Sheet1';
    const API_KEY = 'AIzaSyAzuXKOSUuHAKML1PY04S51Ego9bPJO6oo';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?valueRenderOption=FORMATTED_VALUE&key=${API_KEY}`;

    axios
      .get(url)
      .then((res) => formatObj(res.data))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  const series = () => {
    let firstCategory = 0;
    let secondCategory = 0;
    let thirdCategory = 0;
    let fourthCategory = 0;
    list.forEach((a) => {
      if (a.Age <= 18) firstCategory++;
      if (a.Age >= 19 && a.Age <= 35) secondCategory++;
      if (a.Age >= 36 && a.Age <= 70) thirdCategory++;
      if (a.Age > 70) fourthCategory++;
    });
    return [firstCategory, secondCategory, thirdCategory, fourthCategory];
  };

  const sliceColor = ['#264653', '#2a9d8e', '#eac46a', '#f4a261'];
  const { height } = Dimensions.get('window');

  const Age = ({ age, backgroundColor }) => (
    <View style={styles.age}>
      <View style={[styles.square, { backgroundColor }]} />
      <Text>{age}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {refreshing ? (
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          {list?.length ? (
            <>
              <View style={styles.row}>
                <Text style={styles.title}>Name</Text>
                <Text style={styles.title}>Age</Text>
              </View>

              <View style={styles.line} />

              <View style={{ maxHeight: height / 2 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  refreshing={refreshing}
                  onRefresh={getData}
                  keyExtractor={(item, index) => index}
                  ItemSeparatorComponent={<View style={styles.separator} />}
                  data={list}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <Text style={styles.value}>{item.Name}</Text>
                      <Text style={styles.value}>{item.Age}</Text>
                    </View>
                  )}
                />
              </View>

              <View style={styles.chart}>
                <Text style={{ marginBottom: 10, fontSize: 20 }}>
                  Segmentation
                </Text>
                <PieChart
                  widthAndHeight={height / 4}
                  series={series()}
                  sliceColor={sliceColor}
                />
                <Text style={{ marginTop: 10, fontSize: 20 }}>Index</Text>

                <View style={styles.ages}>
                  <Age age="0-18" backgroundColor="#264653" />
                  <Age age="19-35" backgroundColor="#2a9d8e" />
                  <Age age="36-70" backgroundColor="#eac46a" />
                  <Age age="70+" backgroundColor="#f4a261" />
                </View>
              </View>
            </>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl onRefresh={getData} refreshing={refreshing} />
              }
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 50,
                }}
              >
                No entries. Swipe down to refresh.
              </Text>
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  age: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  ages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
    marginVertical: 10,
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 10,
    height: 10,
    marginRight: 3,
    marginTop: 1,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
    marginVertical: 10,
    opacity: 0.2,
  },
  title: {
    fontSize: 18,
    opacity: 0.8,
    flex: 1,
  },
  value: {
    fontSize: 18,
    flex: 1,
    fontWeight: 'bold',
  },
});

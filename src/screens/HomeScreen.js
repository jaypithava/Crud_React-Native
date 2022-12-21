import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import UserListScreen from './UserListScreen';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateProfileScreen from './UpdateProfile';
import {Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
const db = SQLite.openDatabase(
  {
    name: 'UsersDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

export default function HomeScreen({navigation}) {
  const removeAccountAlert = () => {
    Alert.alert(
      'Remove Account',
      'Are you sure you want to remove the account?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
        },
        {text: 'Yes', onPress: () => removeAccountFromDatabase()},
      ],
    );
  };

  const removeAccountFromDatabase = async () => {
    const value = await AsyncStorage.getItem('userData');
    if (value != null) {
      var dataObj = JSON.parse(value);
      await db.transaction(async tx => {
        await tx.executeSql(
          'DELETE FROM Users WHERE id = ?',
          [dataObj.userId],
          (txObj, results) => {
            console.log('deleteQuery==>' + JSON.stringify(results));
            if (results.rowsAffected === 1) {
              AsyncStorage.removeItem('userData');
              navigation.replace('Login_Screen');
            }
          },
        );
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer independent={true}>
        <Drawer.Navigator
          initialRouteName="User_List"
          screenOptions={{
            headerShown: true,
          }}
          drawerContent={props => {
            return (
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                  label="Remove Account"
                  onPress={() => {
                    removeAccountAlert();
                  }}
                />
                <DrawerItem
                  label="Logout"
                  onPress={async () => {
                    await AsyncStorage.removeItem('userData');
                    navigation.replace('Login_Screen');
                  }}
                />
              </DrawerContentScrollView>
            );
          }}>
          <Drawer.Screen
            name="User_List"
            component={UserListScreen}
            options={{
              title: 'Users',
            }}
          />
          <Drawer.Screen
            name="Update_Profile"
            component={UpdateProfileScreen}
            options={{
              title: 'Update Profile',
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

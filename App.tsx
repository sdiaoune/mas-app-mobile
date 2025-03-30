import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameControls } from './components/GameControls';
import { GameLog } from './components/GameLog';
import { BoxScore } from './components/BoxScore';
import { TabBarBackground } from './components/ui/TabBarBackground.ios';
import { HapticTab } from './components/HapticTab';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarButton: (props) => <HapticTab {...props} />,
            tabBarBackground: () => <TabBarBackground />,
            tabBarStyle: {
              borderTopWidth: 0,
              elevation: 0,
              backgroundColor: 'transparent',
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#999',
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#fff',
          }}
        >
          <Tab.Screen 
            name="Controls" 
            component={GameControls}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="basketball-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Log" 
            component={GameLog}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Stats" 
            component={BoxScore}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FilePickerScreen from '@screens/file_picker_screen';
import VideoDetailsScreen from '@screens/video_details_screen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Directory picker"
          component={FilePickerScreen}
          options={{ title: 'Pick Directory' }}
        />
        <Stack.Screen
          name="Video details"
          component={VideoDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
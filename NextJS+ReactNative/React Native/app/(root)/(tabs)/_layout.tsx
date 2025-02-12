import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import { icons } from "@/constant";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? "bg-tabBar-secondary" : ""
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? "bg-tabBar-secondary" : ""
      } `}
    >
      <Image
        source={source}
        tintColor="#D1EBFE"
        resizeMode="contain"
        className="w-7 h-7 mb-2"
      />
    </View>
  </View>
);

const Layout = () => (
  <Tabs
    initialRouteName="home"
    screenOptions={{
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "white",
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: "#16423C",
        borderRadius: 50,

        paddingBottom: 21,
        marginHorizontal: 98,
        marginBottom: 29,
        height: 73,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: "Home",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.home} />
        ),
      }}
    />
    <Tabs.Screen
      name="history"
      options={{
        title: "History",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.list} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.profile} />
        ),
      }}
    />
  </Tabs>
);

export default Layout;

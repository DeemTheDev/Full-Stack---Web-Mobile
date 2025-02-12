import { Redirect } from "expo-router";

//  useAuth coming from clerk
// Renders home page if signed in

import { useAuth } from "@clerk/clerk-expo";

const Home = () => {
  const { isSignedIn } = useAuth();

  {
    /**If user is signed in successfully go to home page  */
  }
  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  {
    /**If user is not signed in go to onboarding page  */
  }
  return <Redirect href="/(auth)/onboarding" />;
};

export default Home;

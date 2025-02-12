import Link from "next/link";
import Spline from "@splinetool/react-spline/next";
import Image from "next/image";
import PlayStore from "@/assets/icons/playstore.png";
import AppStore from "@/assets/icons/appstore.png";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b text-white bg-black">
      {/* Navigation Bar */}
      <nav className="absolute top-0 right-0 p-6 z-10 ">
        <Link
          href="/auth"
          className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
        >
          Login
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-12">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Transform Your {<span className="text-green-500">Giving </span>}
              Journey
            </h1>
            <p className="text-xl text-gray-300">
              Making charitable giving easier, transparent, and more impactful
              than ever before.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href="https://play.google.com"
                className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
              >
                <Image
                  src={PlayStore}
                  width={24}
                  height={24}
                  alt="Play Store"
                  className="w-6 h-6"
                />
                Get it on Play Store
              </Link>

              <Link
                href="https://apps.apple.com"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors"
              >
                <Image
                  src={AppStore}
                  width={24}
                  height={24}
                  alt="App Store"
                  className="w-6 h-6"
                />
                Download on App Store
              </Link>
            </div>
          </div>

          {/* Spline Animation */}
          <div className="relative  top-0 w-[50%] h-[100%] lg:block">
            <Spline scene="https://prod.spline.design/bpU-YbSGNmDVuD-J/scene.splinecode" />
          </div>
        </div>

        {/* Project Goals Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-xl hover:bg-gray-800 transition-colors duration-300 border border-gray-700">
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Transparent Giving
                </h3>
                <p className="text-gray-300">
                  Track every donation and see the real impact of your
                  contributions in real-time.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl hover:bg-gray-800 transition-colors duration-300 border border-gray-700">
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Community Impact</h3>
                <p className="text-gray-300">
                  Connect with causes that matter and make a difference in your
                  local community.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl hover:bg-gray-800 transition-colors duration-300 border border-gray-700">
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
                <p className="text-gray-300">
                  State-of-the-art security ensuring your donations reach the
                  right hands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pb-8 text-center text-gray-400">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms & Conditions
          </Link>
          <p className="mt-4">© 2024 Your App Name. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}

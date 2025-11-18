export const dynamic = "force-dynamic";
import localFont from "next/font/local";
import { Geist, Mulish } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import Footer from "@/components/Footer";
import { UserProvider } from "@/context/UserContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import BottomTicker2 from "@/components/Ticker";

const convertToPlainObject = (user) => {
  if (user) {
    // Remove any MongoDB-specific methods like `toJSON`
    const plainUser = { ...user };
    delete plainUser._id; // Remove MongoDB's `_id` field if you don't need it
    return plainUser;
  }
  return user;
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "MBAROIMock",
  description: "",
  other: {
    'google-site-verification': 'BLxedYuX1HvUkLQ4DLGZIU9bf4Px4wgEXUmXsMPQXOA',
  },
};

export default async function RootLayout({ children }) {
   let session = null;
  let user = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("NextAuth session error:", error);
    // You can optionally clear cookies here or log out user forcibly
  }

  if (session) {
    try {
      const client = await clientPromise;
      const db = client.db("sample_mflix");
      user = await db.collection("users").findOne({ email: session.user.email });
      user = convertToPlainObject(user);
    } catch (dbError) {
      console.error("DB error:", dbError);
      // fallback, user stays null
    }
  }

  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KR3VCLK9" />
      <GoogleAnalytics gaId="G-F5NWW5896Q" />
      <body
        className={`${geistSans.variable} ${mulish.className} antialiased font-sans`}
      >
         <UserProvider initialUser={user}>
        <Providers>
        <Navbar/>
        {!session && <BottomTicker2 />}
        <main>
        {children}
      </main>
        <Footer/>
        
        </Providers>
        </UserProvider>
      </body>
    </html>
  );
}

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import { UserProvider } from "@/context/UserContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const convertToPlainObject = (user) => {
  if (user) {
    // Remove any MongoDB-specific methods like `toJSON`
    const plainUser = { ...user };
    delete plainUser._id; // Remove MongoDB's `_id` field if you don't need it
    return plainUser;
  }
  return user;
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "MBAROIMock",
  description: "",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  let user = null;
  if (session) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    user = await db.collection("users").findOne({ email: session.user.email });
    user = convertToPlainObject(user); // Convert the user to a plain object
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <UserProvider initialUser={user}>
        <Providers>
        <Navbar/>
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

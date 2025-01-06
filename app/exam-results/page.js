import ExamResultComponent from "@/components/ExamResult";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: 'Detailed Analysis of Mock Attempted By You - MBAROIMOCK',
  description: 'Boost your CMAT 2025 prep with free mock tests! Access high-quality CMAT mocks, analyze performance, and sharpen your skills for exam success. Start now!',
  
  // Open Graph (OG) meta tags for social media
  openGraph: {
    title: 'Detailed Analysis of Mock Attempted By You - MBAROIMOCK',
    description: 'Boost your CMAT 2025 prep with free mock tests! Access high-quality CMAT mocks, analyze performance, and sharpen your skills for exam success. Start now!',
    url: 'https://mock.mbaroi.in/exam-results',
    siteName: 'MBAROIMOCK',
    images: [
      {
        url: '/student.jpg',
        width: 1200,
        height: 630,
        alt: 'mbaroimock',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'MBAROI Mocks - CMAT 2025 Mock Available | Free Mocks',
    description: 'Boost your CMAT 2025 prep with free mock tests! Access high-quality CMAT mocks, analyze performance, and sharpen your skills for exam success. Start now!.',
    images: ['/student.jpg'],
  },

  robots: {
    index: true, // Allow search engines to index
    follow: true, // Allow search engines to follow links
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://www.mywebsite.com/example',
    languages: {
      'en-US': 'https://www.mywebsite.com/example',
      'es-ES': 'https://www.mywebsite.com/es/example',
    },
  },
  other: {
    'theme-color': '#ffffff', // Sets the browser theme color
  },
};

export default async function ExamResultPage(){
     const session = await getServerSession(authOptions);
    
      if (!session) {
        redirect("/login");
      }
    return(
        <Suspense fallback={<div>Loading...</div>}>
        <ExamResultComponent/>
        </Suspense>
    )
}
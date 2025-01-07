import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import TextImageSection from "@/components/TextImageSection";
import JoinOurTeam from "@/components/JoinOurTeam";
import MockTests from "@/components/MockTests";
import Faq from "@/components/FAQ";
import Features from "@/components/Features";
export const metadata = {
    title: 'MBAROI Mocks - CMAT 2025 Mock Available | Free Mocks',
    description: 'Boost your CMAT 2025 prep with free mock tests! Access high-quality CMAT mocks, analyze performance, and sharpen your skills for exam success. Start now!',
    
    // Open Graph (OG) meta tags for social media
    openGraph: {
      title: 'MBAROI Mocks - CMAT 2025 Mock Available | Free Mocks',
      description: 'Boost your CMAT 2025 prep with free mock tests! Access high-quality CMAT mocks, analyze performance, and sharpen your skills for exam success. Start now!',
      url: 'https://mock.mbaroi.in/',
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
  
    // Other meta tags
    viewport: {
      width: 'device-width',
      initialScale: 1,
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
      canonical: 'https://www.mock.mbaroi.in/',
      languages: {
        'en-US': 'https://www.mock.mbaroi.in',
        'es-ES': 'https://www.mock.mbaroi.in',
      },
    },
    other: {
      'theme-color': '#ffffff', // Sets the browser theme color
    },
};

export default function Home() {
  return (
    <>
     
    <div className="">
      <TextImageSection />
      <MockTests />
      <Features/>
      <Faq/>
    </div>
    </>
  );
}



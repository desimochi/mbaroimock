import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import TextImageSection from "@/components/TextImageSection";
import JoinOurTeam from "@/components/JoinOurTeam";
import MockTests from "@/components/MockTests";
import Faq from "@/components/FAQ";
import Features from "@/components/Features";
export const metadata = {
    title: 'MBAROI Mocks - CAT 2025 Mock Available | Free Mocks',
    description: 'Boost your CAT 2025 prep with free mock tests! Access high-quality CAT mocks, analyze performance, and sharpen your skills for exam success. Start now!',
    
    // Open Graph (OG) meta tags for social media
    openGraph: {
      title: 'MBAROI Mocks - CAT 2025 Mock Available | Free Mocks',
      description: 'Boost your CAT 2025 prep with free mock tests! Access high-quality CAT mocks, analyze performance, and sharpen your skills for exam success. Start now!',
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
      title: 'MBAROI Mocks - CAT 2025 Mock Available | Free Mocks',
      description: 'Boost your CAT 2025 prep with free mock tests! Access high-quality CAT mocks, analyze performance, and sharpen your skills for exam success. Start now!.',
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
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@id": "./",
    "@type": "Course",
    "name": "MBA Mock Test",
    "description": "This course is designed for those wishing to take up \r\n       a career in Accounting and Financial Administration within a range of \r\n       organisations....",
    "hasCourseInstance": [
      {
        "@type": "CourseInstance",
        "courseMode": "online-exam",
        "location": "mock.mbaroi.in",
        "startDate": "2024-01-09"
      },
      {
        "@type": "CourseInstance",
        "courseMode": "online-exam",
        "location": "mock.mbaroi.in",
        "startDate": "2024-01-09"
      },
      {
        "@type": "CourseInstance",
        "courseMode": "online-exam",
        "location": "mock.mbaroi.in",
        "startDate": "2024-01-09"
      }
    ]
  }
  
  return (
    <>
     
    <div className="">
      <TextImageSection />
      <MockTests />
      <Features/>
      <Faq/>
    </div>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup),
        }}
      />
    </>
  );
}



export default function sitemap() {
  return [
    {
      url: 'https://mock.mbaroi.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://mock.mbaroi.in/mocks',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
}
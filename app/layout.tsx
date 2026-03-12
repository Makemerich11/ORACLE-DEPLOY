import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyOracle — World + Personal Cosmic Timing',
  description: 'World Energy · Personal Timing · % Probability · Domain Deep-Dives. Multi-system astrological convergence engine.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#07060d' }}>
        {children}
      </body>
    </html>
  )
}

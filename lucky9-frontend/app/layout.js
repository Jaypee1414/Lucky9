import './globals.css'

export const metadata = {
  title: 'Lucky 9 Game',
  description: 'C2W PLAY LUCKY9 ALGO BETA TEST',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
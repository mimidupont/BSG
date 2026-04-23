export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body style={{ fontFamily: 'Arial', padding: 20 }}>
        <h1>MatCorp Tycoon MVP</h1>
        {children}
      </body>
    </html>
  )
}

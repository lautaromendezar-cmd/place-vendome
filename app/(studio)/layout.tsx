/**
 * Layout raíz del panel. A propósito no carga globals.css ni las fuentes del sitio:
 * el Studio trae sus propios estilos y se pisarían entre sí.
 */
export default function StudioRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

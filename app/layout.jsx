import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: "チー牛くん恋愛シミュレーション",
  description: "牛丼店を舞台にした短編恋愛シミュレーションゲーム",
  icons: {
    icon: `${basePath}/favicon.svg`
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

      </Head>
      <body className="font-quicksand">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

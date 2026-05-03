import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { UserProviderWrapper } from './UserProviderWrapper';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-headline', weight: ['400', '600', '700', '800'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] });

export const metadata = { title: 'NATIONAL FREELANCE & SKILL VERIFICATION PLATFORM' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0 }}>
        <UserProviderWrapper>
          {children}
        </UserProviderWrapper>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "./provider";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import CustomNavbar from "../components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Reddit RSS Reader",
    description: "Read and manage Reddit RSS feeds",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Provider>
                <body className={inter.className}>
                    {" "}
                    <CustomNavbar />
                    <Container className="mt-4">{children}</Container>
                </body>
            </Provider>
        </html>
    );
}

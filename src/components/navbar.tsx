"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, Navbar, Nav, Button } from "react-bootstrap";

const CustomNavbar = () => {
    const { status } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/feed");
    };

    const renderSessionButton = () => {
        if (status === "authenticated") {
            return (
                <Button variant="outline-secondary" onClick={handleSignOut}>
                    Sign Out
                </Button>
            );
        } else if (status === "loading") {
            return <span className="text-muted">Loading...</span>;
        } else {
            return (
                <Link href="/login" passHref>
                    <Button variant="outline-secondary">Sign In</Button>
                </Link>
            );
        }
    };
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Reddit RSS Reader</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/feed">Feed</Nav.Link>
                        <Nav.Link href="/admin">Admin</Nav.Link>
                    </Nav>
                    <Nav>{renderSessionButton()}</Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;

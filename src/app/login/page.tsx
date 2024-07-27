"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });
        if (res?.error) {
            setError(res.error as string);
        }
        if (res?.ok) {
            return router.push("/admin");
        }
    };

    return (
        <Container className="d-flex vh-100 align-items-center justify-content-center">
            <Form
                onSubmit={handleSubmit}
                className="p-4 border rounded bg-white"
            >
                {error && <Alert variant="danger">{error}</Alert>}
                <h1 className="mb-4">Sign In</h1>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Sign In
                </Button>
                <div className="mt-3 text-center">
                    <Link href="/register" className="text-muted">
                        Don&apos;t have an account?
                    </Link>
                </div>
            </Form>
        </Container>
    );
}

"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { signIn } from "next-auth/react";

export default function Register() {
    const [error, setError] = useState<string>();
    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const r = await register({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            name: formData.get("name") as string,
        });
        ref.current?.reset();
        if (r?.error) {
            setError(r.error);
            return;
        } else {
            const res = await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false,
            });
            if (res?.error) {
                setError(res.error as string);
            }
            if (res?.ok) {
                return router.push("/feed");
            }
        }
    };

    return (
        <Container className="d-flex vh-100 align-items-center justify-content-center">
            <Form
                ref={ref}
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSubmit(formData);
                }}
                className="p-4 border rounded bg-white"
            >
                {error && <Alert variant="danger">{error}</Alert>}
                <h1 className="mb-4">Register</h1>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        name="name"
                        required
                    />
                </Form.Group>
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
                    Sign Up
                </Button>
                <div className="mt-3 text-center">
                    <Link href="/login" className="text-muted">
                        Already have an account?
                    </Link>
                </div>
            </Form>
        </Container>
    );
}

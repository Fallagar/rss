"use client";

import { useState } from "react";
import {
    Container,
    Card,
    Button,
    Form,
    Dropdown,
    Row,
    Col,
} from "react-bootstrap";
import CustomPagination from "./pagination";
import { IArticle } from "../types/types";
import dateParser from "../utils/dateParser";

const ArticlesList = ({ initialArticles }: { initialArticles: IArticle[] }) => {
    const articles = initialArticles;
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    const filteredArticles = articles
        .filter((article) =>
            article.title.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === "newest") {
                return (
                    new Date(b.pubDate).getTime() -
                    new Date(a.pubDate).getTime()
                );
            } else {
                return (
                    new Date(a.pubDate).getTime() -
                    new Date(b.pubDate).getTime()
                );
            }
        });

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(
        indexOfFirstArticle,
        indexOfLastArticle
    );
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (order: "newest" | "oldest") => {
        setSortOrder(order);
    };

    return (
        <Container>
            <h1>Articles</h1>
            <Form className="mb-3">
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="search">
                            <Form.Control
                                type="text"
                                placeholder="Search by title"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="d-flex justify-content-end">
                        <Dropdown className="ml-auto">
                            <Dropdown.Toggle
                                variant="primary"
                                id="dropdown-basic"
                            >
                                Sort by{" "}
                                {sortOrder === "newest" ? "Newest" : "Oldest"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => handleSortChange("newest")}
                                >
                                    Newest
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleSortChange("oldest")}
                                >
                                    Oldest
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Form>
            {currentArticles.map((article) => (
                <Card key={article._id} className="mb-3">
                    {article.imageUrl ? (
                        <Card.Img
                            variant="top"
                            src={article.imageUrl}
                            className="custom-card-img"
                        />
                    ) : null}
                    <Card.Body>
                        <Card.Title>{article.title}</Card.Title>
                        <Card.Text>
                            posted by{" "}
                            <a
                                href={`http://reddit.com${article.author}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {article.author}
                            </a>{" "}
                            on{" "}
                            <a
                                href={`http://reddit.com/r/${article.subreddit}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                /r/{article.subreddit}
                            </a>
                        </Card.Text>
                        <Card.Text>{dateParser(article.pubDate)}</Card.Text>
                        <Card.Text>{article.contentSnippet}</Card.Text>

                        <Button
                            variant="primary"
                            href={article.link}
                            target="_blank"
                        >
                            Read on Reddit
                        </Button>
                    </Card.Body>
                </Card>
            ))}
            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </Container>
    );
};

export default ArticlesList;

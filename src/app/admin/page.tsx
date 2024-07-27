"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Card,
    Button,
    Form,
    Dropdown,
    Row,
    Col,
    Spinner,
    Modal,
} from "react-bootstrap";
import CustomPagination from "../../components/pagination";
import { IArticle } from "../../types/types";
import dateParser from "../../utils/dateParser";

const AdminPage = () => {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [showHidden, setShowHidden] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalArticle, setModalArticle] = useState<IArticle>({
        title: "",
        link: "",
        pubDate: new Date().toISOString(),
        authorUrl: "",
        author: "",
        imageUrl: "",
        id: "",
        contentSnippet: "",
        hidden: false,
        subredditURL: "",
        subreddit: "",
    });

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await axios.get<{ articles: IArticle[] }>(
                    "/api/articles"
                );
                setArticles(response.data.articles);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const filteredArticles = articles
        .filter((article) => {
            const matchesSearch = article.title
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchesHidden = showHidden ? article.hidden : !article.hidden;
            return matchesSearch && matchesHidden;
        })
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
    };

    const handleSortChange = (order: "newest" | "oldest") => {
        setSortOrder(order);
    };

    const handleShowHiddenChange = () => {
        setShowHidden(!showHidden);
        setCurrentPage(1);
    };

    const handleShowModal = (article?: IArticle) => {
        if (article) {
            setModalArticle(article);
        } else {
            setModalArticle({
                title: "",
                link: "",
                pubDate: new Date().toISOString(),
                authorUrl: "",
                author: "",
                imageUrl: "",
                id: "",
                contentSnippet: "",
                hidden: false,
                subredditURL: "",
                subreddit: "",
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveArticle = async () => {
        try {
            if (modalArticle._id) {
                await axios.put(`/api/articles`, modalArticle);
            } else {
                await axios.post("/api/articles", modalArticle);
            }
            setShowModal(false);

            const response = await axios.get<{ articles: IArticle[] }>(
                "/api/articles"
            );
            setArticles(response.data.articles);
        } catch (error) {
            console.error("Error saving article:", error);
        }
    };

    const handleHideArticle = async (article: IArticle) => {
        try {
            await axios.patch(`/api/articles`, {
                _id: article._id,
                hidden: Boolean(!article.hidden),
            });
            const response = await axios.get<{ articles: IArticle[] }>(
                "/api/articles"
            );
            setArticles(response.data.articles);
        } catch (error) {
            console.error("Error hiding article:", error);
        }
    };
    const handleDeleteArticle = async (article: IArticle) => {
        try {
            await axios.delete(`/api/articles?id=${article._id}`);
            const response = await axios.get<{ articles: IArticle[] }>(
                "/api/articles"
            );
            setArticles(response.data.articles);
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    return (
        <Container>
            <h1>Admin Page</h1>
            <Button className="mb-3" onClick={() => handleShowModal()}>
                Add Article
            </Button>
            <Form className="mb-3">
                <Row className="d-flex align-items-center">
                    <Col md={4}>
                        <Form.Group controlId="search">
                            <Form.Control
                                type="text"
                                placeholder="Search by title"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group
                            controlId="showHidden"
                            className="d-flex align-items-center"
                        >
                            <Form.Check
                                type="checkbox"
                                label="Show Hidden Articles"
                                checked={showHidden}
                                onChange={handleShowHiddenChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex justify-content-end">
                        <Dropdown>
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
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
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
                                <Card.Text>
                                    {dateParser(article.pubDate)}
                                </Card.Text>
                                <Card.Text>{article.contentSnippet}</Card.Text>

                                <Row className="g-2">
                                    <Col className="col-auto">
                                        <Button
                                            variant="primary"
                                            href={article.link}
                                            target="_blank"
                                        >
                                            Read on Reddit
                                        </Button>
                                    </Col>
                                    <Col className="d-flex justify-content-sm-end justify-content-between  gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                handleShowModal(article)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="warning"
                                            onClick={() =>
                                                handleHideArticle(article)
                                            }
                                        >
                                            {article.hidden ? "Unhide" : "Hide"}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleDeleteArticle(article)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalArticle._id ? "Edit Article" : "Add Article"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalArticle.title}
                                onChange={(e) =>
                                    setModalArticle({
                                        ...modalArticle,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="link">
                            <Form.Label>Link</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalArticle.link}
                                onChange={(e) =>
                                    setModalArticle({
                                        ...modalArticle,
                                        link: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="authorUrl">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalArticle.author}
                                onChange={(e) =>
                                    setModalArticle({
                                        ...modalArticle,
                                        author: e.target.value,
                                        authorUrl: `https://reddit.com/u/${e.target.value}`,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="subredditUrl">
                            <Form.Label>Subreddit</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalArticle.subreddit}
                                onChange={(e) =>
                                    setModalArticle({
                                        ...modalArticle,
                                        subreddit: e.target.value,
                                        subredditURL: `https://reddit.com/u/${e.target.value}`,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="imageUrl">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalArticle.imageUrl}
                                onChange={(e) =>
                                    setModalArticle({
                                        ...modalArticle,
                                        imageUrl: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="contentSnippet">
                            <Form.Label>Content Snippet</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={modalArticle.contentSnippet}
                                onChange={(e) =>
                                    setModalArticle({
                                        ...modalArticle,
                                        contentSnippet: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveArticle}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminPage;

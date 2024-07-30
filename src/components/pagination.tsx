"use client";

import { FC } from "react";
import { Pagination } from "react-bootstrap";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handleClick = (newPage: number) => {
        if (newPage !== currentPage) {
            onPageChange(newPage);
        }
    };

    const items = [];
    const visiblePages = 5;
    const halfVisiblePages = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, currentPage + halfVisiblePages);

    if (currentPage - halfVisiblePages < 1) {
        endPage = Math.min(
            totalPages,
            endPage + (halfVisiblePages - currentPage + 1)
        );
    }

    if (currentPage + halfVisiblePages > totalPages) {
        startPage = Math.max(
            1,
            startPage - (currentPage + halfVisiblePages - totalPages)
        );
    }

    if (startPage > 1) {
        items.push(
            <Pagination.Item key={1} onClick={() => handleClick(1)}>
                1
            </Pagination.Item>
        );
        if (startPage > 2) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }
    }

    for (let number = startPage; number <= endPage; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handleClick(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }
        items.push(
            <Pagination.Item
                key={totalPages}
                onClick={() => handleClick(totalPages)}
            >
                {totalPages}
            </Pagination.Item>
        );
    }

    return (
        <Pagination>
            <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handleClick(currentPage - 1)}
            />
            {items}
            <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handleClick(currentPage + 1)}
            />
        </Pagination>
    );
};

export default CustomPagination;

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
    for (let number = 1; number <= totalPages; number++) {
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

    return <Pagination>{items}</Pagination>;
};

export default CustomPagination;

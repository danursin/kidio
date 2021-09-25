import "./Carousel.scss";

import React, { useEffect, useState } from "react";

import { Book } from "../../types";
import { Link } from "react-router-dom";
import { Placeholder } from "semantic-ui-react";
import useDataservice from "../../hooks/useDataService";

const Carousel: React.FC = () => {
    const [books, setBooks] = useState<Book[]>();
    const { query } = useDataservice();

    useEffect(() => {
        (async () => {
            const data = await query<Book>({
                table: "Book",
                select: ["id", "cover_image_url"]
            });

            setBooks(data);
        })();
    }, [query]);

    return (
        <ul className="carousel">
            {!books &&
                [...new Array(5)].map((_, index) => (
                    <li key={index}>
                        <Placeholder style={{ height: "12rem", width: "12rem", display: "inline-block", margin: "1rem 1rem 1rem 0" }}>
                            <Placeholder.Image />
                        </Placeholder>
                    </li>
                ))}

            {!!books &&
                books.map((b) => (
                    <li key={b.id}>
                        <Link to={`/book/${b.id}`}>
                            <img src={b.cover_image_url} alt={`Book ${b.id}`} />
                        </Link>
                    </li>
                ))}
        </ul>
    );
};

export default Carousel;

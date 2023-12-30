import "./Carousel.scss";

import React, { useEffect, useState } from "react";

import { BookItem } from "../../types";
import { Link } from "react-router-dom";
import { Placeholder } from "semantic-ui-react";
import config from "../../config";
import { useAuth0 } from "@auth0/auth0-react";
import useDataservice from "../../hooks/useDataService";

const Carousel: React.FC = () => {
    const [books, setBooks] = useState<BookItem[]>();
    const { query } = useDataservice();

    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        (async () => {
            const token = await getAccessTokenSilently();
            const url = `${config.apiBaseUrl}/book`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const data = (await response.json()) as BookItem[];
            setBooks(data);
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
                    <li key={b.SK}>
                        <Link to={`/book/${b.id}`}>
                            <img src={b.cover_image_url} alt={`Book ${b.id}`} />
                        </Link>
                    </li>
                ))}
        </ul>
    );
};

export default Carousel;
